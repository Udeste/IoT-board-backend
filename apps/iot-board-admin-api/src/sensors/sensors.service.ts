import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Sensor } from 'libs/shared/entities/sensor.entity';
import { CreateSensorDto } from 'libs/shared/dtos/sensor.dto';

@Injectable()
export class SensorsService {
  constructor(@InjectRepository(Sensor)
              private sensorRepository: Repository<Sensor>,
              private readonly projectsService: ProjectsService,
  ) { }

  async getSensorById(id: string): Promise<Sensor> {
    return this.sensorRepository.findOneBy({ id });
  }

  async getSensorByProjectId(projectId: string): Promise<Sensor> {
    return this.sensorRepository.findOneBy({ project: { id: projectId} });
  }
  
  async getAllsensors(): Promise<Sensor[]> {
    return this.sensorRepository.find();
  }

  async createOne(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const id = uuidv4();
    const newSensor = new Sensor()
    newSensor.id = id
    newSensor.description = createSensorDto.description
    newSensor.name = createSensorDto.name
    newSensor.tags = createSensorDto.tags
    newSensor.measurements = createSensorDto.measurements

    const project = await this.projectsService.getProjectById(createSensorDto.projectId)
    newSensor.project = project
  
    const createdSensor = await this.sensorRepository.save(newSensor)
    return createdSensor
  }

  async deleteOne(projId: string): Promise<DeleteResult> {
    return this.sensorRepository.delete(projId);
  }
}
