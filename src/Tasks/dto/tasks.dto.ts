import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export class CreateTaskDTO {
  @ApiProperty({ example: 'Finish the project in nestjs' })
  @IsString()
  title: string;
  
  @ApiProperty({ example: 'create routes' })
  @IsString()
  description: string;
  
  @ApiProperty({ enum: TaskStatus, default: 'pending' })
  @IsEnum(TaskStatus, { message: 'Invalid status. Use pending ou completed.' })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: '2025-06-05T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
export class UpdateTaskDTO {
  @ApiProperty({ example: 'Update task title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'New task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status. Use pending or completed.' })
  status?: TaskStatus;

  @ApiProperty({ example: '2025-06-06T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}

