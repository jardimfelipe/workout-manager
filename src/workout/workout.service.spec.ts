import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";

import { WorkoutDto } from "./dto/workout.dto";
import { Workout, WorkoutDocument } from "./schemas/workout.schema";
import { WorkoutService } from "./workout.service";

const mockUser = {
  name: "John Doe",
  email: "john.doe@email.com",
  isTeacher: false,
  age: 20,
  password: "xxx",
};

const mockWorkoutDoc = (mock?: Partial<Workout>): Partial<WorkoutDocument> => ({
  name: "Treino ABC2x",
  student: mockUser,
  training: [
    {
      name: "A",
      exercises: [
        {
          exercise: "Elevação Lateral",
          series: "5x9",
          method: "Drop-set 3x",
        },
      ],
    },
  ],
});

const mockWorkout: WorkoutDto = {
  name: "Treino ABC2x",
  student: mockUser,
  training: {
    name: "A",
    exercises: [
      {
        exercise: "Elevação Lateral",
        series: "5x9",
        method: "Drop-set 3x",
      },
    ],
  },
};

const mockTasksRepository = () => ({
  createWorkout: jest.fn(),
});

describe("WorkoutService", () => {
  let service: WorkoutService;
  let model: Model<WorkoutDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide: getModelToken(Workout.name),
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkoutService>(WorkoutService);
    model = module.get<Model<WorkoutDocument>>(getModelToken("Workout"));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should ", async () => {
    jest
      .spyOn(model, "create")
      .mockImplementationOnce(() => Promise.resolve({ ...mockWorkout }));

    const workout = await service.createWorkout(mockWorkout, mockUser);
    expect(workout).toEqual(mockWorkout);
  });
});
