import { Workout } from "src/workout/schemas/workout.schema";
import { RolesEnum } from "../schemas/auth.schema";

export interface IUser {
  name: string;
  age: number;
  email: string;
  refreshToken: string;
  password: string;
  role: RolesEnum;
  teacherId: string;
  workouts: Workout[];
  _id: string;
}
