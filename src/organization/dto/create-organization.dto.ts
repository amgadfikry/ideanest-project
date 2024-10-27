import { IsString, IsNotEmpty, IsArray, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationMemberDto } from './organization-member.dto';

// Data transfer object for creating organization
export class CreateOrganizationDto {
  // name of organization
	@ApiProperty({ example: 'Study Org', description: 'Name of organization'})
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  // description of organization
  @ApiProperty({ example: 'Study organization', description: 'Description of organization'})
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty()
  description: string;
}
