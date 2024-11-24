import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { SensorsModule } from './sensors/sensors.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Project } from 'libs/shared/entities/project.entity';
import { Sensor } from 'libs/shared/entities/sensor.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProjectsModule, 
    SensorsModule, 
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Project, Sensor],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
