import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

// ReturnSigninDto class that contains the return object for the signin method
export class ReturnSigninDto {
  // message property that is a string
  @ApiProperty({ example: 'User created successfully', description: 'Message returned after user is created' })
  @IsString()
  @IsNotEmpty()
  message: string;

  // access_token property that is a string
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I...', description: 'JWT access token' })
  @IsString()
  @IsNotEmpty()
  access_token: string;

  // refresh_token property that is a string
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I...', description: 'JWT refresh token' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
