import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import mongoose, { HydratedDocument } from "mongoose";
import { Workout } from "src/workout/schemas/workout.schema";

export type UserDocument = HydratedDocument<User>;

export enum RolesEnum {
  TEACHER = "teacher",
  ADMIN = "admin",
  STUDENT = "student",
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ select: false })
  refreshToken: string;

  @Exclude()
  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  role: RolesEnum;

  @Prop()
  teacherId: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Workout" })
  workouts: Workout[];
}

export const UserSchema = SchemaFactory.createForClass(User);
