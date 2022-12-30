import { IsDateString } from "class-validator";

export class SetNewStudentHistoryDto {
  @IsDateString()
  date: Date;
}
