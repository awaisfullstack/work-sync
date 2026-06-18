import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('WorkSync API')
    .setDescription(
      'WorkSync - Team Task & Shift Management System API Documentation',
    )
    .setVersion('1.0.0')
    .addCookieAuth(
      'access_token',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT cookie set by POST /api/v1/auth/login',
      },
      'access_token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description:
          'Optional bearer token auth. Cookie auth is also supported.',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Health')
    .addTag('Auth')
    .addTag('Dashboard')
    .addTag('Users')
    .addTag('Departments')
    .addTag('Projects')
    .addTag('Tasks')
    .addTag('Shifts')
    .addTag('Activity Logs')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
