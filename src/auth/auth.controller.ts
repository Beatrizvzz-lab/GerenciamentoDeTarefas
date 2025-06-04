import { Body, Controller, Post } from '@nestjs/common';
import { loginDTO, registerDTO } from './dto/auth';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth() 
@Controller('auth')// Defini a rota base do controller: /auth
export class AuthController {
    constructor(
        private authService: AuthService, 
        private prismaService: PrismaService) {}
    //rota post /auth/login
    @Post('login')
    @ApiOperation({ summary: 'log in' })
    @ApiResponse({ status: 200, description: 'login successfully created' })
    async login(@Body() body: loginDTO) {
     return this.authService.login(body.email, body.password);// Chama o método de login do AuthService passando o email e a senha
    }
    //rota post /auth/register
    @Post('register')
     @ApiOperation({ summary: 'registered user' })
    @ApiResponse({ status: 200, description: 'register successfully created' })
    async register(@Body() body:  registerDTO) {
       return this.authService.register(body);// Chama o método de registro do AuthService passando os dados do usuário
    }
}
