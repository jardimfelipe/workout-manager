import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { HydratedDocument } from "mongoose";

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
}

export const UserSchema = SchemaFactory.createForClass(User);
