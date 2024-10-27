import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

// Update User DTO class that extends the CreateUserDto class and uses the PartialType() method to make all the properties optional.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // refresh token
  @ApiProperty()
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
