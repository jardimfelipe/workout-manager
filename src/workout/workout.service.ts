import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/auth/schemas/auth.schema";
import { WorkoutDto } from "./dto/workout.dto";

import { Workout, WorkoutDocument } from "./schemas/workout.schema";

@Injectable()
export class WorkoutService {
  private logger = new Logger("WorkoutRepository", { timestamp: true });
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>
  ) {}

  async createWorkout(workoutDto: WorkoutDto, user: User): Promise<Workout> {
    try {
      return this.workoutModel.create({ ...workoutDto, createdBy: user });
    } catch (error) {
      this.logger.error(
        `Failed to create workout for user ${
          user.name
        }. Filters: ${JSON.stringify(workoutDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
