import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto, ProjectDto } from '../dtos/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({ description: 'A list of projects', type: [ProjectDto] })
  async getAll(): Promise<ProjectDto[]> {
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  @ApiResponse({ description: 'A single project', type: ProjectDto })
  async getbyId(@Param('id') id: number): Promise<ProjectDto> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @ApiResponse({ description: 'The created project', type: ProjectDto })
  async createOne(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.createOne(createProjectDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<ProjectDto> {
    return this.projectsService.deleteOne(id);
  }
}
