import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";

// This module will provide the PasswordService to other modules
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
