import { Injectable } from '@nestjs/common';
import { SensorDto } from 'src/dtos/sensor.dto';
import { ProjectsService } from '../projects/projects.service';
import { genRandomId } from 'src/utils/id';

@Injectable()
export class SensorsService {
  private sensors: SensorDto[] = [];

  constructor(private readonly projectsService: ProjectsService) {}

  async getSensorById(projId: number): Promise<SensorDto> {
    return this.sensors.find(({ id }) => id === projId);
  }

  async getAllsensors(): Promise<SensorDto[]> {
    return this.sensors;
  }

  async createOne(sensorDto: SensorDto): Promise<SensorDto> {
    const id = genRandomId();
    const newSensor = {
      ...sensorDto,
      id,
    };
    this.sensors.push(newSensor);
    await this.projectsService.assignSensor(newSensor.projectId, newSensor.id);
    return newSensor;
  }

  async deleteOne(projId: number): Promise<SensorDto> {
    const index = this.sensors.findIndex(({ id }) => id === projId);
    return this.sensors.splice(index, 1)[0];
  }
}
