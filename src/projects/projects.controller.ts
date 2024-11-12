import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  @ApiResponse({ description: 'A list of projects', type: [Project] })
  async getAll(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  @ApiResponse({ description: 'A single project', type: Project })
  async getbyId(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @ApiResponse({ description: 'The created project', type: Project })
  async createOne(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createOne(createProjectDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<DeleteResult> {
    return this.projectsService.deleteOne(id);
  }
}
