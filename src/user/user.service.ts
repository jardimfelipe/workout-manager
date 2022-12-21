import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "../auth/schemas/auth.schema";
import { GetStudentsByTeacherDto } from "./dto/students-by-teacher-dto";
import { WorkoutService } from "src/workout/workout.service";
import { Workout } from "src/workout/schemas/workout.schema";

@Injectable()
export class UserService {
  private logger = new Logger("UserService", { timestamp: true });
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private workoutService: WorkoutService
  ) {}

  async getStudentsByTeacher(
    getStudentsByTeacherDto: GetStudentsByTeacherDto,
    user: User
  ): Promise<any[]> {
    const { teacherId } = getStudentsByTeacherDto;
    return await this.userModel.find({ teacherId }).populate("workouts");
  }
}
