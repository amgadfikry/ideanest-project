import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { OrganizationMemberDto } from './organization-member.dto';

// Data transfer object for returning organization data
export class ReturnedOrganizationDto {
  // id of organization
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  @Expose()
  id: string;

  // name of organization
  @ApiProperty()
  @Expose()
  name: string;

  // description of organization
  @ApiProperty()
  @Expose()
  description: string;

  // list of organization members
  @ApiProperty()
  @Expose()
  organization_members: OrganizationMemberDto[];
}
