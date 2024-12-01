import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateProjectDto, UpdateProjectDto } from 'libs/shared/dtos/project.dto'
import { ProjectsService } from './projects.service'
import { Project } from 'libs/shared/entities/project.entity'
import { UpdateResult } from 'typeorm'
import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { MQTT_EVENTS } from 'libs/shared/constants/mqtt.events'

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService,
              @Inject('TRANSPORTER_SERVICE') private transporterService: ClientProxy
  ) { }

  @Get()
  @ApiResponse({ description: 'A list of projects', type: [Project] })
  @MessagePattern(MQTT_EVENTS.GET_ALL_PROJECTS)
  async getAll(): Promise<Project[]> {
    return this.projectsService.getAllProjects()
  }

  @Get(':id')
  @ApiResponse({ description: 'A single project', type: Project })
  @MessagePattern(MQTT_EVENTS.GET_PROJECT_BY_ID)
  async getbyId(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id)
  }

  @Post()
  @ApiResponse({ description: 'The created project', type: Project })
  async createOne(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = await this.projectsService.createOne(createProjectDto)
    this.transporterService.emit(MQTT_EVENTS.CREATED_ONE_PROJECT, newProject)
    return newProject
  }

  @Put()
  @ApiResponse({ description: 'The updated project', type: Project })
  async updateOne(@Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
    const updatedProj = await this.projectsService.updateOne(updateProjectDto)
    this.transporterService.emit(MQTT_EVENTS.UPDATED_ONE_PROJECT, updatedProj)
    return updatedProj
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<Project> {
    const proj = await this.projectsService.deleteOne(id)
    this.transporterService.emit(MQTT_EVENTS.DELETED_ONE_PROJECT, proj)
    return proj
  }
}
