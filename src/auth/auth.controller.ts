import { Body, Controller, Logger, Param, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials-dto";
import { AuthSignUpDto } from "./dto/auth-signup-dto";
import { RefreshTokenDto } from "./dto/refresh-token-dto";
import { LogoutDto } from "./dto/logout.dto";

@Controller("auth")
export class AuthController {
  private logger = new Logger("WorkoutController");
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() authCredentialsDto: AuthSignUpDto): Promise<void> {
    this.logger.verbose(
      `User "${authCredentialsDto.email}" is trying to signup ${JSON.stringify(
        authCredentialsDto
      )}`
    );
    return this.authService.signUp(authCredentialsDto);
  }

  @Post("/refresh")
  validateRefreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.verbose(
      `User "${
        refreshTokenDto.id
      }" is trying to validate refreshtoken ${JSON.stringify(refreshTokenDto)}`
    );
    return this.authService.validateRefreshToken(refreshTokenDto);
  }

  @Post("/logout")
  logout(@Body() logoutDto: LogoutDto): Promise<void> {
    this.logger.verbose(
      `User "${logoutDto.id}" is trying to logout ${JSON.stringify(logoutDto)}`
    );
    return this.authService.logout(logoutDto);
  }

  @Post("/signin")
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.verbose(
      `User "${authCredentialsDto.email}" is trying to login ${JSON.stringify(
        authCredentialsDto
      )}`
    );
    return this.authService.signIn(authCredentialsDto);
  }
}
