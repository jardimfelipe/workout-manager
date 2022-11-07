import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/auth/schemas/auth.schema";
import { ITraining } from "../schemas/workout.schema";

export class WorkoutDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  training: ITraining;

  @IsNotEmpty()
  student: User;
}
