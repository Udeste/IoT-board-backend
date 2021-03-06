import { ApiProperty } from '@nestjs/swagger';

export class SensorDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  projectId: number;
}