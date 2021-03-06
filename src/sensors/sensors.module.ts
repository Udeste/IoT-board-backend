import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

@Module({
  imports: [ProjectsModule],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule {}
