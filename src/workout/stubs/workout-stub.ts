import { Roles } from "src/auth/schemas/auth.schema";
import { IWorkout } from "../interfaces/workout-interfaces";
import { WorkoutDocument } from "../schemas/workout.schema";

export const mockUser = (
  name = "Treino MOCK",
  email = "john.doe@email.com",
  isTeacher = false,
  age = 20,
  password = "password",
  role = Roles.TEACHER
) => ({
  name,
  email,
  isTeacher,
  age,
  password,
  role,
});

export const mockWorkoutDoc = (
  mock?: Partial<IWorkout>
): Partial<WorkoutDocument> => ({
  name: "Treino ABC2x",
  student: mockUser(),
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

export const mockWorkout = (
  name = "Treino MOCK",
  _id = "636c217fadafdbc595bc2000",
  student = mockUser(),
  createdBy = mockUser(),
  training = [
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
  ]
): IWorkout => ({
  name,
  _id,
  student,
  createdBy,
  training,
});

export const mockWorkoutArray = [
  mockWorkout(),
  mockWorkout("treino", "newId"),
  mockWorkout("novo treino", "any id"),
];
