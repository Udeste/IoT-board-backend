import { Injectable } from '@nestjs/common';
import { CreateProjectDto, ProjectDto } from '../dtos/project.dto';
import { genRandomId } from '../utils/id';

@Injectable()
export class ProjectsService {
  private projects: ProjectDto[] = [];

  async getProjectById(projId: number): Promise<ProjectDto> {
    return this.projects.find(({ id }) => id === projId);
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    return this.projects;
  }

  async createOne(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    const id = genRandomId();
    const newProject = {
      ...createProjectDto,
      id,
      sensors: [],
    };
    this.projects.push(newProject);
    return newProject;
  }

  async deleteOne(projId: number): Promise<ProjectDto> {
    const index = this.projects.findIndex(({ id }) => id === projId);
    return this.projects.splice(index, 1)[0];
  }

  async assignSensor(projectID: number, sensorId: number): Promise<ProjectDto> {
    const project = this.projects.find(({ id }) => id === projectID);
    project.sensors.push(sensorId);
    return project;
  }
}
