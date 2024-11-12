import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}

export class UpdateProjectDto {
  @ApiProperty({ required: true })
  id: string;
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  description?: string;
}
