import { Body, Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";
import { User } from "src/auth/schemas/auth.schema";
import { WorkoutDto } from "./dto/workout.dto";
import { Workout } from "./schemas/workout.schema";
import { WorkoutService } from "./workout.service";

@Controller("workout")
@UseGuards(AuthGuard())
export class WorkoutController {
  private logger = new Logger("WorkoutController");
  constructor(private workoutService: WorkoutService) {}

  @Post()
  createTask(
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
}
