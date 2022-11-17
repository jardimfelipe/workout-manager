import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { WorkoutDto } from "./workout.dto";

export class WorkoutPutParamDto {
  @IsString()
  id: string;
}

export class WorkoutPutDto {
  @Type(() => WorkoutPutParamDto)
  params: WorkoutPutParamDto;

  @Type(() => WorkoutDto)
  body: WorkoutDto;
}
