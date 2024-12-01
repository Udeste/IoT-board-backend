import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from 'libs/shared/dtos/sensor.dto';
import { Sensor } from 'libs/shared/entities/sensor.entity';
import { DeleteResult } from 'typeorm';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { MQTT_EVENTS } from 'libs/shared/constants/mqtt.events';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService,
              @Inject('TRANSPORTER_SERVICE') private transporterService: ClientProxy
  ) { }

  @Get()
  @ApiResponse({ description: 'A list of sensors', type: [Sensor] })
  @MessagePattern(MQTT_EVENTS.GET_ALL_SENSORS)
  async getAll(): Promise<Sensor[]> {
    return this.sensorsService.getAllsensors();
  }

  @Get(':id')
  @ApiResponse({ description: 'A single sensor', type: Sensor })
  @MessagePattern(MQTT_EVENTS.GET_SENSOR_BY_ID)
  async getbyId(@Param('id') id: string): Promise<Sensor> {
    return this.sensorsService.getSensorById(id);
  }

  @Get(':name')
  @ApiResponse({ description: 'A single sensor', type: Sensor })
  @MessagePattern(MQTT_EVENTS.GET_SENSOR_BY_NAME)
  async getbyName(@Param('name') name: string): Promise<Sensor> {
    return this.sensorsService.getSensorByName(name);
  }

  @Get('/by-project/:projectId')
  @ApiResponse({ description: 'A single sensor', type: Sensor })
  async getbyProjectID(@Param('projectId') projectId: string): Promise<Sensor> {
    return this.sensorsService.getSensorByProjectId(projectId);
  }

  @Post()
  @ApiResponse({ description: 'The created sensor', type: Sensor })
  async createOne(@Body() createSensor: CreateSensorDto): Promise<Sensor> {
    this.transporterService.emit(MQTT_EVENTS.CREATED_ONE_SENSOR, createSensor)
    return this.sensorsService.createOne(createSensor);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<DeleteResult> {
    this.transporterService.emit(MQTT_EVENTS.DELETED_ONE_SENSOR, id)
    return this.sensorsService.deleteOne(id);
  }

}
