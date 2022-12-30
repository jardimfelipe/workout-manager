import { Workout } from "src/workout/schemas/workout.schema";
import { RolesEnum } from "../schemas/auth.schema";
import { IBodyMeasurements } from "./body-measurements";

export interface IUser {
  name: string;
  age: number;
  email: string;
  refreshToken: string;
  password: string;
  role: RolesEnum;
  teacherId: string;
  trainingHistory: Date[];
  bodyMeasurements: IBodyMeasurements;
  workouts: Workout[];
  _id: string;
}
