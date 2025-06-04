import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './Prisma/prisma.module';
import { TasksModule } from './Tasks/tasks.module';
import { UsersModule } from './Users/users.module';

@Module({
  imports: 
  [
    AuthModule, 
    PrismaModule, 
    TasksModule,
    UsersModule 
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}