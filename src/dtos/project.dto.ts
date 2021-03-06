import { ApiProperty } from '@nestjs/swagger';
import { SensorDto } from './sensor.dto';

export class ProjectDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  sensors: number[];
}

export class CreateProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
