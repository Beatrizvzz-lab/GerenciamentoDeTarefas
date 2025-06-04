import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../Prisma/prisma.service';
import { TaskStatus } from './dto/tasks.dto';
import { BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockPrisma = {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a task with dueDate', async () => {
      const dto = {
        title: 'Test task',
        description: 'Some description',
        status: TaskStatus.PENDING,
        dueDate: new Date(),
      };

      const userId = 123;

      const expected = {
        id: 1,
        ...dto,
        dueDate: new Date(dto.dueDate),
        userId,
      };

      mockPrisma.task.create.mockResolvedValue(expected);

      const result = await service.create(dto, userId);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          dueDate: new Date(dto.dueDate),
          userId,
        },
      });

      expect(result).toEqual(expected);
    });

    it('should create a task with null dueDate if not provided', async () => {
      const dto = {
        title: 'No due date task',
        description: 'Some description',
        status: TaskStatus.PENDING,
      };

      const userId = 321;

      const expected = {
        id: 2,
        ...dto,
        dueDate: null,
        userId,
      };

      mockPrisma.task.create.mockResolvedValue(expected);

      const result = await service.create(dto, userId);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          dueDate: null,
          userId,
        },
      });

      expect(result).toEqual(expected);
    });
  });

  describe('findAll()', () => {
    it('should throw BadRequestException for invalid status', async () => {
      await expect(service.findAll(1, 'invalid' as TaskStatus)).rejects.toThrow(BadRequestException);
    });

    it('should return all tasks for user without status filter', async () => {
      const expected = [{ id: 1, title: 'Task 1' }];
      mockPrisma.task.findMany.mockResolvedValue(expected);

      const result = await service.findAll(1);
      expect(result).toEqual(expected);
      expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
    });

    it('should return filtered tasks with status', async () => {
      const expected = [{ id: 2, title: 'Task 2', status: TaskStatus.PENDING }];
      mockPrisma.task.findMany.mockResolvedValue(expected);

      const result = await service.findAll(1, TaskStatus.PENDING);
      expect(result).toEqual(expected);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1, status: TaskStatus.PENDING },
      });
    });
  });

  describe('findById()', () => {
    it('should return the task if it exists', async () => {
      const task = { id: 1, userId: 1, title: 'Test Task' };
      mockPrisma.task.findFirstOrThrow.mockResolvedValue(task);

      const result = await service.findById(1, 1);
      expect(result).toEqual(task);
      expect(prisma.task.findFirstOrThrow).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
    });
  });

  describe('update()', () => {
    it('should update a task after checking existence', async () => {
      const task = { id: 1, userId: 1, title: 'Old Title' };
      const update = { title: 'New Title' };
      const updated = { ...task, ...update };

      mockPrisma.task.findFirstOrThrow.mockResolvedValue(task);
      mockPrisma.task.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, update);
      expect(result).toEqual(updated);
      expect(prisma.task.update).toHaveBeenCalledWith({ where: { id: 1 }, data: update });
    });
  });

  describe('delete()', () => {
    it('should delete a task and return message', async () => {
      mockPrisma.task.findFirstOrThrow.mockResolvedValue({ id: 1 });
      mockPrisma.task.delete.mockResolvedValue({});

      const result = await service.delete(1, 1);
      expect(result).toEqual({ message: 'task excluded' });
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});