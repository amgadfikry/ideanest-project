import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

// HydratedDocument type to define the type of the UserDocument
export type UserDocument = HydratedDocument<User>;

// Schema for the User collection
@Schema()
export class User {
  // Unique email address of user
  @Prop({ required: true, unique: true })
  email: string;

  // Password
  @Prop({ required: true })
  password: string;

  // Full name of user
  @Prop({ required: true })
  name: string;

  // refresh token
  @Prop({ required: false, default: null })
  refresh_token: string;
}

// Create the schema for the User collection
export const UserSchema = SchemaFactory.createForClass(User);