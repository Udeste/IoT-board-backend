import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './project.dto';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project)
              private projectRepository: Repository<Project>) {}

  async getProjectById(id: string): Promise<Project> {
    return this.projectRepository.findOneBy({ id });
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({ loadRelationIds: true });
  }

  async createOne(createProjectDto: CreateProjectDto): Promise<Project> {
    const id = uuidv4();
    const newProject = new Project()
    newProject.id = id
    newProject.description = createProjectDto.description
    newProject.name = createProjectDto.name
  
    return this.projectRepository.save(newProject)
  }

  async deleteOne(projId: string): Promise<DeleteResult> {
    return this.projectRepository.delete(projId);
  }
}
