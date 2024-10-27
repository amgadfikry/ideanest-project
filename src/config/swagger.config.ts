import { DocumentBuilder } from '@nestjs/swagger';

// swagger configuration options for the application
export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ideanest project APIs documentaion')
  .setDescription('The full details for Ideanest project APIs routes')
  .setVersion('1.0')
  .addCookieAuth('token')
  .addBearerAuth(
    {
      type: 'http', // 'http' or 'apiKey'
      scheme: 'bearer', // 'bearer' or 'basic'
      bearerFormat: 'JWT', // 'JWT' or 'Token'
      name: 'Authorization', // name of the header or cookie
      description: 'Enter JWT token', // description of the header or cookie
      in: 'header', // 'header', 'query' or 'cookie'
    },
    'JWT-auth' // name of the security scheme
  )
  .build();
