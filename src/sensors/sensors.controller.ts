import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SensorDto } from 'src/dtos/sensor.dto';
import { SensorsService } from './sensors.service';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiResponse({ description: 'A list of sensors', type: [SensorDto] })
  async getAll(): Promise<SensorDto[]> {
    return this.sensorsService.getAllsensors();
  }

  @Get(':id')
  @ApiResponse({ description: 'A single sensor', type: SensorDto })
  async getbyId(@Param('id') id: number): Promise<SensorDto> {
    return this.sensorsService.getSensorById(id);
  }

  @Post()
  @ApiResponse({ description: 'The created sensor', type: SensorDto })
  async createOne(
    @Body() createSensorDto: SensorDto,
  ): Promise<SensorDto> {
    return this.sensorsService.createOne(createSensorDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<SensorDto> {
    return this.sensorsService.deleteOne(id);
  }

}
