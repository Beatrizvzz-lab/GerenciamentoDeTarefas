import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { registerDTO } from '../auth/dto/auth';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: registerDTO) { 
    const hashedPassword = await bcrypt.hash(data.password, 10); // Criptografa a senha
    const existingUser = await this.prisma.user.findUnique({ 
      where: { email: data.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe'); 
    }

    const user = await this.prisma.user.create({ 
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'Usuário registrado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('senha inválida');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
