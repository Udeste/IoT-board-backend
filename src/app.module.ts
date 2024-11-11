import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { SensorsDataModule } from './sensors-data/sensors-data.module';
import { SensorsController } from './sensors/sensors.controller';
import { SensorsModule } from './sensors/sensors.module';
import { SensorsService } from './sensors/sensors.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Project } from './projects/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProjectsModule, 
    SensorsModule, 
    SensorsDataModule, 
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Project],
      synchronize: true,
    }),
  ],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class AppModule {}
