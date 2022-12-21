import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schemas/auth.schema";
import { ITraining } from "../interfaces/workout-interfaces";

export class WorkoutDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  training: ITraining[];

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  createdBy: string;
}
