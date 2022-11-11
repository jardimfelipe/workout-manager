import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "src/auth/schemas/auth.schema";
import { WorkoutQueryDto } from "./dto/workout-query-dto";
import { WorkoutDto } from "./dto/workout.dto";

import { Workout, WorkoutDocument } from "./schemas/workout.schema";

@Injectable()
export class WorkoutService {
  private logger = new Logger("WorkoutRepository", { timestamp: true });
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>
  ) {}

  async createWorkout(workoutDto: WorkoutDto, user: User): Promise<Workout> {
    try {
      return this.workoutModel.create({ ...workoutDto, createdBy: user });
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
}
