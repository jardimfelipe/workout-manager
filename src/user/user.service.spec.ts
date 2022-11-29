import { BadRequestException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";

import { User, UserDocument } from "../auth/schemas/auth.schema";
import { mockUser } from "../workout/stubs/workout-stub";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockReturnValue([mockUser()]),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should retreive students list by teacher", async () => {
    const students = await service.getStudentsByTeacher(
      {
        teacherId: mockUser().teacherId,
      },
      mockUser()
    );
    expect(students).toEqual([mockUser()]);
  });

  it("should retreive empty array", async () => {
    jest.spyOn(model, "find").mockReturnValueOnce([] as any);
    const students = await service.getStudentsByTeacher(
      {
        teacherId: "wrong id",
      },
      mockUser()
    );
    expect(students).toEqual([]);
  });

  it("should throw 400 when teacher id is not passed", async () => {
    jest
      .spyOn(model, "find")
      .mockReturnValueOnce(new BadRequestException() as any);
    expect(
      await service.getStudentsByTeacher(
        {
          teacherId: "",
        },
        mockUser()
      )
    ).toEqual(new BadRequestException());
  });
});
