import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDBConfig } from './config/mongodb.config';
import { redisConfig } from './config/redis.config';
import { UserModule } from './user/user.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OrganizationModule } from './organization/organization.module';

// Main module of the application to import all the other modules
@Module({
  imports: [
    CacheModule.registerAsync(redisConfig), // Register the Redis cache
    MongooseModule.forRoot(mongoDBConfig.uri), // Connect to MongoDB
    UserModule,
    PasswordModule,
    AuthModule,
    TransactionModule,
    OrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
