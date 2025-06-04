import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../Prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'Test' }];
      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findById()', () => {
    it('should return the user with selected fields', async () => {
      const user = { id: 1, name: 'Test', email: 'Test@example.com' };
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(result).toEqual(user);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true, email: true },
      });
    });
  });

  describe('update()', () => {
    it('should update the user with hashed password', async () => {
      const user = { id: 1, name: 'Test', email: 'Test@example.com' };
      const dto = { name: 'Test', password: '123456' };
      const hashed = 'hashed_password';

      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.update(1, dto);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...dto, password: hashed },
      });
      expect(result).toEqual({ message: 'User successfully update' });
    });

    it('should update the user without password', async () => {
      const user = { id: 1, name: 'test', email: 'test@example.com' };
      const dto = { name: 'test' };

      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.update(1, dto);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
      expect(result).toEqual({ message: 'User successfully update' });
    });
  });

  describe('delete()', () => {
    it('should delete the user after finding it', async () => {
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue({ id: 1 });
      mockPrisma.user.delete.mockResolvedValue({});

      const result = await service.delete(1);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
      }));
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'User successfully deleted' });
    });
  });
});