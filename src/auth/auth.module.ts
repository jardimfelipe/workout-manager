import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/auth.schema";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: 10 },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule {}
