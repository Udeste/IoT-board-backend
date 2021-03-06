import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { SensorsDataModule } from './sensors-data/sensors-data.module';
import { SensorsController } from './sensors/sensors.controller';
import { SensorsModule } from './sensors/sensors.module';
import { SensorsService } from './sensors/sensors.service';

@Module({
  imports: [ProjectsModule, SensorsModule, SensorsDataModule],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class AppModule {}
