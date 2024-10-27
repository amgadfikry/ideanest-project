import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from "../password/password.module";

// get JWT_SECRET from .env file
const JWT_SECRET = process.env.JWT_SECRET;

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    UserModule,
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
