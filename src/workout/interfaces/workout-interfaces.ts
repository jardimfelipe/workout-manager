import { User } from "src/auth/schemas/auth.schema";

export interface IExercise {
  method: string;
  series: string;
  exercise: string;
}

export interface ITraining {
  name: string;
  exercises: IExercise[];
}

export interface IWorkout {
  _id: string;
  name: string;
  training: ITraining[];
  student: User;
  isActive: boolean;
  createdBy: User;
}
