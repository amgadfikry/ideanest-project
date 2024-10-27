import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for payload of User
export class PayloadUserDto {
  // id of user
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  // Unique email address of User
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

  // Full name of user
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
