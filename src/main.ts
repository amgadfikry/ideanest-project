import * as dotenv from 'dotenv';

// This line loads the environment variables from the .env file into the process.env object
// before the application starts so that they can be accessed throughout the application.
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';

// This function is the entry point of the application.
async function bootstrap() {
  // Create a new Nest application instance.
  const app = await NestFactory.create(AppModule);

  // Create the Swagger document and set up the Swagger UI
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable CORS for all routes
  app.enableCors({
    // Allow all origins
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });

  // Start the application on port 8080
  await app.listen(8080);
}
bootstrap();
