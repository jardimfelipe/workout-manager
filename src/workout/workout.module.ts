import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { WorkoutService } from "./workout.service";
import { WorkoutController } from "./workout.controller";
import { Workout, WorkoutSchema } from "./schemas/workout.schema";
import { AuthModule } from "src/auth/auth.module";

@Module({
  providers: [WorkoutService],
  controllers: [WorkoutController],
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema }]),
    AuthModule,
  ],
})
export class WorkoutModule {}
