import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { AuthGuard } from '../guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

// OrganizationModule that contains the OrganizationController and OrganizationService
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, AuthGuard],
})
export class OrganizationModule {}
