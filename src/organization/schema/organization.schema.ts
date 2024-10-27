import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { OrganizationMemberDto } from '../dto/organization-member.dto';

// HydratedDocument type to define the type of the OrganizationDocument
export type OrganizationDocument = HydratedDocument<Organization>;

// Schema for the Organization collection
@Schema()
export class Organization {
  // name of organization
  @Prop({ required: true })
  name: string;

  // description of organization
  @Prop({ required: true })
  description: string;

  // organization_members array of user name, email and acess_level
  @Prop({ type: OrganizationMemberDto, required: true })
  organization_members: OrganizationMemberDto[];

}

// Create the schema for the Organization collection
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
