import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "../auth/schemas/auth.schema";
import { GetStudentsByTeacherDto } from "./dto/students-by-teacher-dto";
import { WorkoutService } from "src/workout/workout.service";
import { SetNewStudentHistoryDto } from "./dto/set-student-history-dto";
import { IUser } from "src/auth/Interface/user";

@Injectable()
export class UserService {
  private logger = new Logger("UserService", { timestamp: true });
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async getStudentsByTeacher(
    getStudentsByTeacherDto: GetStudentsByTeacherDto
  ): Promise<IUser[]> {
    const { teacherId } = getStudentsByTeacherDto;
    try {
      return await this.userModel.find({ teacherId }).populate("workouts");
    } catch (error) {
      this.logger.error(
        `Failed to get student by teacher. Teacher: ${teacherId}.`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async setNewStudentHistory(
    setNewStudentHistoryDto: SetNewStudentHistoryDto,
    user: IUser
  ): Promise<IUser> {
    const { date } = setNewStudentHistoryDto;
    try {
      return await this.userModel.findByIdAndUpdate(user._id, {
        $push: { trainingHistory: date },
      });
    } catch (error) {
      this.logger.error(
        `Failed to set user history ${user.name}. Params: ${JSON.stringify(
          setNewStudentHistoryDto
        )}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
