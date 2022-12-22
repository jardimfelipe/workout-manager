import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";
import { IUser } from "src/auth/Interface/user";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { RolesEnum, User } from "src/auth/schemas/auth.schema";
import { BodyAndParam } from "src/decorators/body-and-param-decorator";
import { WorkoutPatchDto } from "./dto/workout-patch-dto";
import { WorkoutPutDto } from "./dto/workout-put.dto";
import {
  WorkoutQueryDto,
  WorkoutStudentQueryDto,
} from "./dto/workout-query-dto";
import { WorkoutDto } from "./dto/workout.dto";
import { Workout } from "./schemas/workout.schema";
import { WorkoutService } from "./workout.service";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("workouts")
export class WorkoutController {
  private logger = new Logger("WorkoutController");
  constructor(private workoutService: WorkoutService) {}

  @Post()
  @Roles(RolesEnum.TEACHER)
  createWorkout(
    @Body() workoutDto: WorkoutDto,
    @GetUser() user: IUser
  ): Promise<Workout> {
    this.logger.verbose(
      `User "${user.name}" creating a workout. Data ${JSON.stringify(
        workoutDto
      )}`
    );
    return this.workoutService.createWorkout(workoutDto, user);
  }

  @Get()
  @Roles(RolesEnum.TEACHER)
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

  @Get("/student")
  @Roles(RolesEnum.STUDENT)
  getWorkoutsByStudent(
    @Query() workoutQueryDto: WorkoutStudentQueryDto,
    @GetUser() user: User
  ): Promise<Workout[]> {
    this.logger.verbose(
      `User "${user.name}" retrieving workouts. Data ${JSON.stringify(
        workoutQueryDto
      )}`
    );
    return this.workoutService.getWorkoutsByStudent(workoutQueryDto, user);
  }

  @Get("/:id")
  @Roles(RolesEnum.TEACHER)
  getWorkoutById(
    @Param() id: { id: string },
    @GetUser() user: User
  ): Promise<Workout> {
    this.logger.verbose(
      `User "${user.name}" retrieving workout by id. Id ${JSON.stringify(id)}`
    );
    return this.workoutService.getWorkoutById(id, user);
  }

  @Patch("/:id")
  @Roles(RolesEnum.TEACHER)
  changeWorkoutStatus(
    @BodyAndParam() WorkoutPatchDto: WorkoutPatchDto,
    @GetUser() user: IUser
  ): Promise<Workout> {
    return this.workoutService.changeWorkoutStatus(WorkoutPatchDto, user);
  }

  @Put("/:id")
  @Roles(RolesEnum.TEACHER)
  editWorkout(
    @BodyAndParam() WorkoutPutDto: WorkoutPutDto,
    @GetUser() user: IUser
  ): Promise<Workout> {
    return this.workoutService.editWorkout(WorkoutPutDto, user);
  }
}
