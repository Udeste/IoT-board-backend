import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectDto, CreateProjectDto } from 'src/dtos/project.dto';

describe('Projects Controller', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of projects', async () => {
      const results: ProjectDto[] = [
        {
          id: 12,
          name: 'test',
          description: 'test project',
          sensors: [],
        },
      ];
      jest
        .spyOn(projectsService, 'getAllProjects')
        .mockImplementation(() => Promise.resolve(results));

      expect(await controller.getAll()).toBe(results);
    });
  });

  describe('getbyId', () => {
    it('should return an single of project', async () => {
      const result: ProjectDto = {
        id: 12,
        name: 'test',
        description: 'test project',
        sensors: [],
      };
      jest
        .spyOn(projectsService, 'getProjectById')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.getbyId(12)).toBe(result);
    });
  });

  describe('createOne', () => {
    it('should return the created project with an new id', async () => {
      const newProject: CreateProjectDto = {
        name: 'test',
        description: 'test project'
      };
      const result = { ...newProject, id: 1, sensors: [] };

      jest
        .spyOn(projectsService, 'createOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.createOne(newProject)).toBe(result);
    });
  });

  describe('deleteOne', () => {
    it('should return the deleted project', async () => {
      const result: ProjectDto = {
        id: 1,
        sensors: [],
        name: 'test',
        description: 'test project'
      };

      jest
        .spyOn(projectsService, 'deleteOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.deleteOne(1)).toBe(result);
    });
  });
});
