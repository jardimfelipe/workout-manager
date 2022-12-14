import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IUser } from "src/auth/Interface/user";
import { User, UserDocument } from "src/auth/schemas/auth.schema";
import { WorkoutPatchDto } from "./dto/workout-patch-dto";
import { WorkoutPutDto } from "./dto/workout-put.dto";
import {
  WorkoutQueryDto,
  WorkoutStudentQueryDto,
} from "./dto/workout-query-dto";
import { WorkoutDto } from "./dto/workout.dto";

import { Workout, WorkoutDocument } from "./schemas/workout.schema";

@Injectable()
export class WorkoutService {
  private logger = new Logger("WorkoutRepository", { timestamp: true });
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createWorkout(workoutDto: WorkoutDto, user: IUser): Promise<Workout> {
    try {
      const { studentId } = workoutDto;
      await this.workoutModel.updateMany(
        { student: studentId },
        { $set: { isActive: false } }
      );

      const workout = await this.workoutModel.create({
        ...workoutDto,
        student: { _id: studentId },
        createdBy: user._id,
        isActive: true,
      });
      await this.userModel.findByIdAndUpdate(studentId, {
        $push: { workouts: workout._id },
      });

      return workout;
    } catch (error) {
      this.logger.error(
        `Failed to create workout for user ${
          user.name
        }. Filters: ${JSON.stringify(workoutDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async getWorkouts(
    workoutQueryDto: WorkoutQueryDto,
    user: User
  ): Promise<Workout[]> {
    const { name, student } = workoutQueryDto;
    try {
      return this.workoutModel
        .find({ name: new RegExp(name, "i") })
        .where({ ...(student ? { student } : {}), createdBy: user })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to get workouts for user ${
          user.name
        }. Filters: ${JSON.stringify(workoutQueryDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
  async getWorkoutsByStudent(
    workoutQueryDto: WorkoutStudentQueryDto,
    user: User
  ): Promise<Workout[]> {
    const { name } = workoutQueryDto;
    try {
      return this.workoutModel
        .find({ name: new RegExp(name, "i") })
        .where({ student: user })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to get workouts for user ${
          user.name
        }. Filters: ${JSON.stringify(workoutQueryDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
  async getWorkoutById({ id }: { id: string }, user: User): Promise<Workout> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.logger.error(
        `Failed to get workout for user ${
          user.name
        }. Invalid id: ${JSON.stringify(id)}`
      );
      throw new ConflictException("Invalid params");
    }
    const found = this.workoutModel
      .findById(id)
      .where({ createdBy: user })
      .exec();

    if (!found) {
      this.logger.error(
        `Failed to get workout for user ${user.name}. id: ${JSON.stringify(id)}`
      );
      throw new NotFoundException("Workout not found");
    }

    return found;
  }
  async changeWorkoutStatus(
    workoutPatchDto: WorkoutPatchDto,
    user: IUser
  ): Promise<Workout> {
    const {
      body: { isActive },
      params: { id },
    } = workoutPatchDto;
    const found = await this.workoutModel.findById(id);
    if (found.createdBy !== user._id.toString()) {
      this.logger.error(
        `Failed to edit workout status, ${user.name} is not authorized`
      );
      throw new UnauthorizedException();
    }
    try {
      return this.workoutModel.findOneAndUpdate(
        { _id: id },
        {
          isActive,
        },
        { new: true }
      );
    } catch (error) {
      this.logger.error(`Failed to edit workout isActive. ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }
  async editWorkout(
    workoutPutDto: WorkoutPutDto,
    user: IUser
  ): Promise<Workout> {
    const {
      body,
      params: { id },
    } = workoutPutDto;
    const found = await this.workoutModel.findById(workoutPutDto.params.id);
    const { createdBy, ...rest } = body;
    if (found.createdBy !== user._id) {
      this.logger.error(
        `Failed to edit ${body.name}, ${user.name} is not authorized`
      );
      throw new UnauthorizedException();
    }

    try {
      return this.workoutModel.findOneAndUpdate(
        { _id: id },
        { ...rest },
        { new: true }
      );
    } catch (error) {
      this.logger.error(`Failed to edit workout ${body.name}. ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }
}
