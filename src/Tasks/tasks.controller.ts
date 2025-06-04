import { Controller, Get, Post, Body, Put, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO, TaskStatus } from './dto/tasks.dto';
import { UpdateTaskDTO } from './dto/tasks.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse,ApiBearerAuth,ApiQuery } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  
@Get()
@ApiOperation({ summary: 'List all tasks' })
@ApiQuery({ name: 'status', enum: TaskStatus, required: false })
@ApiResponse({ status: 200, description: 'Task list returned successfully.' })
findAll(@Request() req, @Query('status') status: TaskStatus) {
  const userId = req.user.userId;
  return this.tasksService.findAll(userId, status);
}

@Post()
@ApiOperation({ summary: 'Create a new task' })
@ApiResponse({ status: 201, description: 'Task created successfully.' })
create(@Body() data: CreateTaskDTO, @Request() req) {
  return this.tasksService.create(data, req.user.userId);
}

@Get(':id')
@ApiOperation({ summary: 'Search for a task by ID' })
@ApiResponse({ status: 200, description: 'Task found successfully.' })
@ApiResponse({ status: 404, description: 'Task not found.' })
findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
  return this.tasksService.findById(id, req.user.userId);
}

@Put(':id')
@ApiOperation({ summary: 'Update an existing task' })
@ApiResponse({ status: 200, description: 'Task updated successfully.' })
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() data: UpdateTaskDTO,
  @Request() req
) {
  return this.tasksService.update(id, req.user.userId, data);
}

@Delete(':id')
@ApiOperation({ summary: 'Remove a task' })
@ApiResponse({ status: 200, description: 'Task removed successfully.' })
remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
  return this.tasksService.delete(id, req.user.userId);
}
}

