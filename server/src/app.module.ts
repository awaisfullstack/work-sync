import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import configuration from './config/configuration';
import {
  ActivityLogsModule,
  AuthModule,
  DashboardModule,
  DepartmentsModule,
  ProjectsModule,
  ShiftsModule,
  TasksModule,
  UsersModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    SequelizeModule.forRoot(databaseConfig()),
    UsersModule,
    AuthModule,
    DepartmentsModule,
    ProjectsModule,
    TasksModule,
    ShiftsModule,
    DashboardModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
