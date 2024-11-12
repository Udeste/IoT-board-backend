import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  projectId: string;
}
