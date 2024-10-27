import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';

// Data transfer object for updating organization
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
