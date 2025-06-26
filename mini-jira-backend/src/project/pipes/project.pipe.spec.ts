import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_SERVICE_TOKEN } from '../../common/constants/injection-tokens';
import { IUserService } from '../../user/interfaces/user-service.interface';
import { AddMemberDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../services/project.service';
import { AddMemberPipe, CreateProjectPipe } from './project.pipe';

describe('ProjectPipe', () => {
  let createProjectPipe: CreateProjectPipe;
  let addMemberPipe: AddMemberPipe;
  let projectService: jest.Mocked<ProjectService>;
  let userService: jest.Mocked<IUserService>;

  beforeEach(async () => {
    const mockProjectService = {
      findOneByKey: jest.fn(),
    };

    const mockUserService = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByUsernameOrEmail: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateLastActivity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectPipe,
        AddMemberPipe,
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
        {
          provide: USER_SERVICE_TOKEN,
          useValue: mockUserService,
        },
      ],
    }).compile();

    createProjectPipe = module.get<CreateProjectPipe>(CreateProjectPipe);
    addMemberPipe = module.get<AddMemberPipe>(AddMemberPipe);
    projectService = module.get(ProjectService);
    userService = module.get(USER_SERVICE_TOKEN);
  });

  describe('CreateProjectPipe', () => {
    it('should be defined', () => {
      expect(createProjectPipe).toBeDefined();
    });

    it('should return project when key does not exist', async () => {
      const project = { key: 'TEST-001' } as Project;
      jest.spyOn(projectService, 'findOneByKey').mockResolvedValue(null);

      const result = await createProjectPipe.transform(project);

      expect(result).toBe(project);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(projectService.findOneByKey).toHaveBeenCalledWith('TEST-001');
    });

    it('should throw ConflictException when project key already exists', async () => {
      const project = { key: 'TEST-001' } as Project;
      const existingProject = { id: '1', key: 'TEST-001' } as Project;
      jest
        .spyOn(projectService, 'findOneByKey')
        .mockResolvedValue(existingProject);

      await expect(createProjectPipe.transform(project)).rejects.toThrow(
        'Project key already exists',
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(projectService.findOneByKey).toHaveBeenCalledWith('TEST-001');
    });
  });

  describe('AddMemberPipe', () => {
    it('should be defined', () => {
      expect(addMemberPipe).toBeDefined();
    });

    it('should return addMemberDto when user exists', async () => {
      const addMemberDto = { userId: 'user-123' } as AddMemberDto;
      const user = { id: 'user-123', username: 'testuser' };
      jest.spyOn(userService, 'findById').mockResolvedValue(user as any);

      const result = await addMemberPipe.transform(addMemberDto);

      expect(result).toBe(addMemberDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.findById).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const addMemberDto = { userId: 'nonexistent-user' } as AddMemberDto;
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(addMemberPipe.transform(addMemberDto)).rejects.toThrow(
        'User not found',
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.findById).toHaveBeenCalledWith('nonexistent-user');
    });
  });
});
