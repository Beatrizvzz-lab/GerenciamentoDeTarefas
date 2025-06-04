
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/Prisma/prisma.service';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({ // Configuração do módulo JWT
      secret: process.env.JWT_SECRET || 'SecretKey',
      signOptions: { expiresIn: '1h' }, // Tempo de expiração do token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports:[JwtModule, AuthService]
})
export class AuthModule {}// Módulo de autenticação que importa o JwtModule e define o AuthController e AuthService como provedores
