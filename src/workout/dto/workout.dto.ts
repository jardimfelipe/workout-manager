import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/auth/schemas/auth.schema";
import { ITraining } from "../interfaces/workout-interfaces";

export class WorkoutDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  training: ITraining[];

  @IsNotEmpty()
  student: User;

  @IsNotEmpty()
  createdBy: User;
}
