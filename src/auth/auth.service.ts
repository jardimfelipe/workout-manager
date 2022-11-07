import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User, UserDocument } from "./schemas/auth.schema";
import { AuthCredentialsDto } from "./dto/auth-credentials-dto";
import { AuthSignUpDto } from "./dto/auth-signup-dto";

const CONFLICT_ERROR_CODE = 11000;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const { password } = authSignUpDto;

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);

    const user = new this.userModel({
      ...authSignUpDto,
      password: hashedpassword,
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException("Usuário já cadastrado");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = this.jwtService.sign({ email });
      return { accessToken };
    } else {
      throw new UnauthorizedException("Email ou senha incorretos");
    }
  }
}
