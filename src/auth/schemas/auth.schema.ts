import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum Roles {
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
  @Prop({ required: true })
  password: string;

  @Prop()
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
