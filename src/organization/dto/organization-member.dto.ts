import { IsEmail, IsString, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for organization member
export class OrganizationMemberDto {
  // email address of User
	@ApiProperty({ example: 'dr.amgad_sh92@yahoo.com', description: 'email address of user'})
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsNotEmpty()
	email: string;

  // Full name of user
  @ApiProperty({ example: 'John Doe', description: 'Full name of user'})
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  // Access level of user
  @ApiProperty({ example: 'admin', description: 'Access level of user'})
  @IsString({ message: 'Access level must be a string' })
  @IsNotEmpty()
  access_level: string;
}
