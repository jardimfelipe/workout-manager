import { IsString } from "class-validator";

export class GetStudentsByTeacherDto {
  @IsString()
  teacherId: String;
}
