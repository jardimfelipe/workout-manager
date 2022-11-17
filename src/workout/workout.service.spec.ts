import { createMock } from "@golevelup/ts-jest";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";

import { Workout, WorkoutDocument } from "./schemas/workout.schema";
import { mockUser, mockWorkout, mockWorkoutArray } from "./stubs/workout-stub";
import { WorkoutService } from "./workout.service";

describe("WorkoutService", () => {
  let service: WorkoutService;
  let model: Model<WorkoutDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide: getModelToken(Workout.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockWorkout()),
            find: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            update: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    model = module.get<Model<WorkoutDocument>>(getModelToken(Workout.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new workout", async () => {
    const workout = await service.createWorkout(mockWorkout(), mockUser());
    expect(workout).toEqual(mockWorkout());
  });

  it("should retreive workouts list by user and query", async () => {
    jest.spyOn(model, "find").mockReturnValueOnce(
      createMock({
        where: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValueOnce(mockWorkoutArray),
      }) as any
    );
    const workouts = await service.getWorkouts(
      {
        name: "",
        student: mockUser(),
      },
      mockUser()
    );
    expect(workouts).toEqual(mockWorkoutArray);
  });

  it("should retreive workout by id", async () => {
    jest.spyOn(model, "findById").mockReturnValueOnce(
      createMock({
        where: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValueOnce(mockWorkout()),
      }) as any
    );
    const found = await service.getWorkoutById(
      { id: mockWorkout()._id },
      mockUser()
    );
    expect(found).toEqual(mockWorkout());
  });

  it("should change workout status", async () => {
    const workoutMock = mockWorkout();
    const params = {
      isActive: false,
      id: workoutMock._id,
    };
    const alteredWorkoutMock = mockWorkout(
      workoutMock.name,
      workoutMock._id,
      workoutMock.student,
      workoutMock.createdBy,
      params.isActive
    );
    jest
      .spyOn(model, "findOneAndUpdate")
      .mockResolvedValueOnce(alteredWorkoutMock);
    const alteredWorkout = await service.changeWorkoutStatus(
      { body: { isActive: params.isActive }, params: { id: params.id } },
      mockUser()
    );
    expect(alteredWorkout).toEqual(alteredWorkoutMock);
  });
});
