import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { User, UserSchema } from "src/auth/schemas/auth.schema";
import { WorkoutModule } from "src/workout/workout.module";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    WorkoutModule,
  ],
})
export class UserModule {}
