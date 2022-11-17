import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { RolesEnum } from "../schemas/auth.schema";

export class AuthSignUpDto {
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsString()
  @MinLength(8, { message: "Senha menor do que o permitido" })
  @MaxLength(32, { message: "Senha maior do que o permitido" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Escolha uma senha mais forte",
  })
  password: string;

  @IsEnum(RolesEnum)
  role: RolesEnum;
}
