import { IsBoolean, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schemas/auth.schema";

export class WorkoutQueryDto {
  @IsOptional()
  name: string;

  @IsOptional()
  student: User;
}

export class WorkoutStudentQueryDto {
  @IsOptional()
  name: string;
}
