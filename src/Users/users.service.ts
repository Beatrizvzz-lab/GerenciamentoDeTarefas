import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { UpdateUserDTO } from './dto/dto.Users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select:{
        id:true,
        name:true,
        email:true,
      }
    });
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.findById(id);
    const updatedData = {
      ...data,} 
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10)
      }
      await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
    return { message: 'User successfully update' }
  }

  async delete(id: number) {
    await this.findById(id);
    await this.prisma.user.delete({
      where: { id },
    });
     return { message: 'User successfully deleted' };
  }
}
