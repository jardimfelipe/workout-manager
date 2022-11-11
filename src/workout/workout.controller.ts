import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";
import { User } from "src/auth/schemas/auth.schema";
import { WorkoutQueryDto } from "./dto/workout-query-dto";
import { WorkoutDto } from "./dto/workout.dto";
import { Workout } from "./schemas/workout.schema";
import { WorkoutService } from "./workout.service";

@Controller("workouts")
@UseGuards(AuthGuard())
export class WorkoutController {
  private logger = new Logger("WorkoutController");
  constructor(private workoutService: WorkoutService) {}

  @Post()
  createWorkout(
    @Body() workoutDto: WorkoutDto,
    @GetUser() user: User
  ): Promise<Workout> {
    this.logger.verbose(
      `User "${user.name}" creating a workout. Data ${JSON.stringify(
        workoutDto
      )}`
    );
    return this.workoutService.createWorkout(workoutDto, user);
  }

  @Get()
  getWorkouts(
    @Query() workoutQueryDto: WorkoutQueryDto,
    @GetUser() user: User
  ): Promise<Workout[]> {
    this.logger.verbose(
      `User "${user.name}" retrieving workouts. Data ${JSON.stringify(
        workoutQueryDto
      )}`
    );
    return this.workoutService.getWorkouts(workoutQueryDto, user);
  }

  @Get("/:id")
  getWorkoutById(
    @Param() id: { id: string },
    @GetUser() user: User
  ): Promise<Workout> {
    this.logger.verbose(
      `User "${user.name}" retrieving workout by id. Id ${JSON.stringify(id)}`
    );
    return this.workoutService.getWorkoutById(id, user);
  }
}
