import { IsEmail, IsString } from "class-validator";

export class CreateStudentDto {
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @IsString()
  name: string;

  @IsString()
  teacherId: string;
}
