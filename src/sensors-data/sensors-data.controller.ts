import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  QuerySensorDataDto,
  SensorDataDto,
  SensorDataValueDto,
} from '../dtos/sensor-data.dto';
import { SensorsDataService } from './sensors-data.service';

@ApiTags('sensors-data')
@Controller('sensors-data')
export class SensorsDataController {
  constructor(private readonly sensorsDataService: SensorsDataService) {}

  @Get('query')
  querySensorData(
    @Query() query: QuerySensorDataDto,
  ): Observable<SensorDataValueDto[]> {
    return this.sensorsDataService.querySensorData(query);
  }

  @Post()
  logSensorData(@Body() logSensorDataDto: SensorDataDto): Observable<boolean> {
    return this.sensorsDataService.logSensorData(logSensorDataDto);
  }
}
