import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "../auth/schemas/auth.schema";
import { GetStudentsByTeacherDto } from "./dto/students-by-teacher-dto";

@Injectable()
export class UserService {
  private logger = new Logger("UserService", { timestamp: true });
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getStudentsByTeacher(
    getStudentsByTeacherDto: GetStudentsByTeacherDto,
    user: User
  ): Promise<User[]> {
    const { teacherId } = getStudentsByTeacherDto;
    return await this.userModel.find({ teacherId });
  }
}
