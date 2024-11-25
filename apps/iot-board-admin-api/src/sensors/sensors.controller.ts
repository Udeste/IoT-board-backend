import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from 'libs/shared/dtos/sensor.dto';
import { Sensor } from 'libs/shared/entities/sensor.entity';
import { DeleteResult } from 'typeorm';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) { }

  @Get()
  @ApiResponse({ description: 'A list of sensors', type: [Sensor] })
  @MessagePattern({ cmd: 'sensors:getAll' })
  async getAll(): Promise<Sensor[]> {
    return this.sensorsService.getAllsensors();
  }

  @Get(':id')
  @ApiResponse({ description: 'A single sensor', type: Sensor })
  @MessagePattern({ cmd: 'sensors:getbyId' })
  async getbyId(@Param('id') id: string): Promise<Sensor> {
    return this.sensorsService.getSensorById(id);
  }

  @Get('/by-project/:projectId')
  @ApiResponse({ description: 'A single sensor', type: Sensor })
  async getbyProjectID(@Param('projectId') projectId: string): Promise<Sensor> {
    return this.sensorsService.getSensorByProjectId(projectId);
  }

  @Post()
  @ApiResponse({ description: 'The created sensor', type: Sensor })
  async createOne(@Body() createSensor: CreateSensorDto): Promise<Sensor> {
    return this.sensorsService.createOne(createSensor);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<DeleteResult> {
    return this.sensorsService.deleteOne(id);
  }

}
