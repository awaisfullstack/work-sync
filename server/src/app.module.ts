import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { DepartmentsModule } from './departments/departments.module';
import configuration from './config/configuration';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
