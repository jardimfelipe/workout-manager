import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User, UserDocument } from "./schemas/auth.schema";
import { AuthCredentialsDto } from "./dto/auth-credentials-dto";
import { AuthSignUpDto } from "./dto/auth-signup-dto";
import { RefreshTokenDto } from "./dto/refresh-token-dto";
import { ConfigService } from "@nestjs/config";
import { LogoutDto } from "./dto/logout.dto";

const CONFLICT_ERROR_CODE = 11000;

@Injectable()
export class AuthService {
  private logger = new Logger("AuthRepo", { timestamp: true });
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.userModel.findOne({ email }).select("+password");
    const isAuthorized =
      user && (await bcrypt.compare(password, user.password));

    if (!isAuthorized) {
      throw new UnauthorizedException("Email ou senha incorretos");
    }

    const { accessToken, refreshToken } = await this.getTokens(user);
    this.updateRefreshToken(user, refreshToken);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedToken = await bcrypt.hash(refreshToken, salt);
    return this.userModel.updateOne(user, { refreshToken: hashedToken });
  }

  async getTokens(
    user: UserDocument
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, _id, role, name, age, bodyMeasurements } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign({ email, _id, role, name, age, bodyMeasurements }),
      this.jwtService.sign(
        { email },
        { secret: this.configService.get("REFRESH_SECRET"), expiresIn: "90d" }
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async validateRefreshToken({
    refreshToken,
    id,
  }: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userModel.findById({ _id: id });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException("Acesso negado");
    const isTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );
    if (!isTokenMatching) {
      this.logger.error(`Failed to get new token for user ${user.name}.`);
      throw new NotFoundException("Acesso negado");
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async logout({ id }: LogoutDto): Promise<void> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { refreshToken: undefined }
    );
  }
}
