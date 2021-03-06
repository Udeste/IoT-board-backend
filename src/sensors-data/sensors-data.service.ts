import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import {
  QuerySensorDataDto,
  SensorDataDto,
  SensorDataValueDto,
} from '../dtos/sensor-data.dto';

@Injectable()
export class SensorsDataService {
  private sensorsData: {
    [key: number]: SensorDataValueDto[];
  } = {};

  querySensorData(query: QuerySensorDataDto): Observable<SensorDataValueDto[]> {
    const sensor = this.sensorsData[query.sensorId];
    return of(
      sensor.filter(
        value =>
          value.timestamp >= query.startTime &&
          value.timestamp <= query.endTime,
      ),
    );
  }

  logSensorData(sensorDataDto: SensorDataDto): Observable<boolean> {
    if (!this.sensorsData[sensorDataDto.sensorId]) {
      this.sensorsData[sensorDataDto.sensorId] = [];
    }
    this.sensorsData[sensorDataDto.sensorId].push({
      value: sensorDataDto.value,
      timestamp: sensorDataDto.timestamp,
    });
    return of(true);
  }
}
