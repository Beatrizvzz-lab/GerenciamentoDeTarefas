import { ValidationPipe } from '@nestjs/common';

export const GlobalValidationPipe = new ValidationPipe({ 
  whitelist: true, //remove as propriedades que não estão no DTO
  forbidNonWhitelisted: true, // lança um erro se houver propriedades não permitidas
  transform: true,// transforma os dados de entrada para o tipo especificado no DTO
});
