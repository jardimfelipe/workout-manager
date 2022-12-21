import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { WorkoutService } from "./workout.service";
import { WorkoutController } from "./workout.controller";
import { Workout, WorkoutSchema } from "./schemas/workout.schema";
import { AuthModule } from "src/auth/auth.module";
import { User, UserSchema } from "src/auth/schemas/auth.schema";

@Module({
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [WorkoutService],
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
})
export class WorkoutModule {}
