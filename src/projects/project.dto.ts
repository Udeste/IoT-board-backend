import { ApiProperty } from '@nestjs/swagger';
import { IProject } from './project.entity';

export class CreateProjectDto implements IProject {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  topic: string
}

export class UpdateProjectDto implements IProject {
  @ApiProperty({ required: true })
  id: string;
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  topic?: string;
}
