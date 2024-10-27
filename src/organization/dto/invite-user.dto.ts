import { PickType } from "@nestjs/swagger";
import { OrganizationMemberDto } from "./organization-member.dto";

// Data transfer object for inviting user to organization
export class InviteUserDto extends PickType(OrganizationMemberDto, ['email']) {}
