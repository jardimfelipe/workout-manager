import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { AuthGuard } from "@nestjs/passport";

import { WorkoutService } from "../src/workout/workout.service";
import {
  Workout,
  WorkoutDocument,
  WorkoutSchema,
} from "../src/workout/schemas/workout.schema";
import { AppModule } from "src/app.module";
import { Model } from "mongoose";
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from "./mongoose-memory";
import {
  mockUser,
  mockWorkout,
  mockWorkoutArray,
} from "src/workout/stubs/workout-stub";

const AuthGuardMock = {
  canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    request.user = mockUser(undefined, "mock@mock.com", undefined, undefined);
    return true;
  },
};

describe("Workout", () => {
  let app: INestApplication;
  let model: Model<WorkoutDocument>;
  let service: WorkoutService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Workout.name, schema: WorkoutSchema },
        ]),
      ],
      providers: [
        WorkoutService,
        {
          provide: getModelToken(Workout.name),
          useValue: { create: jest.fn(), find: jest.fn(), where: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue(AuthGuardMock)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    model = module.get<Model<WorkoutDocument>>(getModelToken(Workout.name));
    service = module.get<WorkoutService>(WorkoutService);

    await app.init();
  });

  it("/POST workout", async () => {
    jest
      .spyOn(service, "createWorkout")
      .mockImplementationOnce(() => Promise.resolve(mockWorkout()));
    await request(app.getHttpServer())
      .post("/workouts")
      .send(mockWorkout())
      .expect(201);
  });

  it("/POST workout throws error validation", async () => {
    const { name, ...rest } = mockWorkout();
    await request(app.getHttpServer()).post("/workouts").send(rest).expect(400);
  });

  it("/GET workouts", async () => {
    jest
      .spyOn(service, "getWorkouts")
      .mockImplementationOnce(() => Promise.resolve(mockWorkoutArray));
    const response = await request(app.getHttpServer())
      .get("/workouts")
      .expect(200);

    const data = response.body;
    expect(data[0].name).toEqual(mockWorkoutArray[0].name);
  });

  it("/GET workout by id", async () => {
    jest
      .spyOn(service, "getWorkoutById")
      .mockImplementationOnce(() => Promise.resolve(mockWorkout()));
    const response = await request(app.getHttpServer())
      .get(`/workouts/${mockWorkout()._id}`)
      .expect(200);

    const data = response.body;
    expect(data.name).toEqual(mockWorkout().name);
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});
