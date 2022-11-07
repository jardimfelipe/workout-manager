import { IsEmail, IsString } from "class-validator";

export class AuthCredentialsDto {
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @IsString()
  password: string;
}
