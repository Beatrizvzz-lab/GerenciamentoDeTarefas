import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);// Configura o GlobalValidationPipe para validação global de requisições

  // Configuração da documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('API - Gerenciador de Tarefas')
    .setDescription('Sistema de tarefas com login JWT, CRUD de tarefas e usuários')
    .setVersion('1.0')
    .addBearerAuth() // habilita JWT na documentação
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
