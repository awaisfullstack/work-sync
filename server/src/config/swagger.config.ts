import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('WorkSync API')
    .setDescription(
      'WorkSync — Team Task & Shift Management System API Documentation',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth')
    .addTag('Departments')
    .addTag('Users')
    .addTag('Projects')
    .addTag('Project Members')
    .addTag('Tasks')
    .addTag('Task Assignments')
    .addTag('Task Comments')
    .addTag('Shifts')
    .addTag('Activity Logs')
    .addTag('Dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
