import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDto {
  @ApiProperty()
  timestamp: number;
  @ApiProperty()
  value: number;
  @ApiProperty()
  sensorId: number;
}

export class QuerySensorDataDto {
  @ApiProperty()
  sensorId: number;
  @ApiProperty()
  startTime: number;
  @ApiProperty()
  endTime: number;
}

export class SensorDataValueDto {
  @ApiProperty()
  timestamp: number;
  @ApiProperty()
  value: number;
}
