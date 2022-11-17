import { Type } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class WorkoutPatchParamDto {
  @IsString()
  id: string;
}

export class WorkoutPatchBodyDto {
  @IsBoolean()
  isActive: boolean;
}

export class WorkoutPatchDto {
  @Type(() => WorkoutPatchParamDto)
  params: WorkoutPatchParamDto;

  @Type(() => WorkoutPatchBodyDto)
  body: WorkoutPatchBodyDto;
}
