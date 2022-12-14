import {
  Controller,
  Get,
  UseGuards,
  Query,
  Logger,
  Patch,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";

import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { RolesEnum, User } from "src/auth/schemas/auth.schema";
import { GetStudentsByTeacherDto } from "./dto/students-by-teacher-dto";
import { UserService } from "./user.service";
import { IUser } from "src/auth/Interface/user";
import { SetNewStudentHistoryDto } from "./dto/set-student-history-dto";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("users")
export class UserController {
  private logger = new Logger("UserController");
  constructor(private readonly userService: UserService) {}

  @Get("/students")
  @Roles(RolesEnum.TEACHER)
  findAll(
    @Query() getStudentsByTeacherDto: GetStudentsByTeacherDto,
    @GetUser() user: User
  ): Promise<IUser[]> {
    this.logger.verbose(
      `User "${user.name}" getting student by teacher. Data ${JSON.stringify(
        getStudentsByTeacherDto
      )}`
    );
    return this.userService.getStudentsByTeacher(getStudentsByTeacherDto);
  }

  @Patch("/students/history")
  @Roles(RolesEnum.STUDENT)
  setNewStudentHistory(
    @Body() setNewStudentHistoryDto: SetNewStudentHistoryDto,
    @GetUser() user: IUser
  ): Promise<IUser> {
    this.logger.verbose(
      `User "${user.name}" setting student history. Data ${JSON.stringify(
        setNewStudentHistoryDto
      )}`
    );
    return this.userService.setNewStudentHistory(setNewStudentHistoryDto, user);
  }
}
