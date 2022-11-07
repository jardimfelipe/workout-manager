import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

import { User } from "../../auth/schemas/auth.schema";

export type WorkoutDocument = mongoose.HydratedDocument<Workout>;

export interface IExercise {
  method: string;
  series: string;
  exercise: string;
}

export interface ITraining {
  name: string;
  exercises: IExercise[];
}

@Schema({ _id: false })
export class Exercise {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  series: string;

  @Prop({ required: true })
  exercise: string;
}

const ExerciseSchema = SchemaFactory.createForClass(Exercise);

@Schema()
export class Training {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [ExerciseSchema], required: true })
  exercises: IExercise[];
}

const TrainingSchema = SchemaFactory.createForClass(Training);

@Schema()
export class Workout {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [TrainingSchema], required: true })
  training: ITraining[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  student: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
