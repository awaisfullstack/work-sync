import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('DATABASE_URL'),
        autoLoadModels: true,
        synchronize: false, // keep false in production, use migrations instead
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Neon requires SSL
          },
        },
      }),
    }),
    // SequelizeModule.forRoot(databaseConfig()),
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
