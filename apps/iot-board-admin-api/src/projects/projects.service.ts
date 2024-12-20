import { Injectable } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from 'libs/shared/dtos/project.dto';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'libs/shared/entities/project.entity';

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
    newProject.topic = createProjectDto.topic
  
    return this.projectRepository.save(newProject)
  }

  async deleteOne(id: string): Promise<Project> {
    const proj = this.projectRepository.findOneBy({ id });
    await this.projectRepository.delete(id);
    return proj;
  }

  async updateOne(updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(updateProjectDto.id, updateProjectDto);
    return this.projectRepository.findOneBy({ id: updateProjectDto.id });
  }
}
