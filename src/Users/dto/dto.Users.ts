
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateUserDTO {

  @ApiPropertyOptional({ example: 'usuario@exemplo.com', description: 'New user email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'novaSenha123', description: 'New user password' })
  @IsString()
  @IsOptional()
  password?: string;
  
}