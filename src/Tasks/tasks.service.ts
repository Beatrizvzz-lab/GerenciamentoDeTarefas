import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateTaskDTO, TaskStatus } from './dto/tasks.dto';
import { UpdateTaskDTO } from './dto/tasks.dto';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, status?: TaskStatus) {
    if(status && !Object.values(TaskStatus).includes(status)) { 
      throw new BadRequestException('invalid status'); 
    } 
    return this.prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
    });
  }

  async create(data: CreateTaskDTO, userId: number) {
    return this.prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId,
      },
    });
  }

  async findById(id: number, userId: number) {
    return this.prisma.task.findFirstOrThrow({
      where: { id, userId },
    });
  }

  async update(id: number, userId: number, data: UpdateTaskDTO) {
    await this.findById(id, userId);
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    await this.findById(id, userId); 
    await this.prisma.task.delete({ where: { id } })
    return {message: "task excluded"};
  }
}
