import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Response, Role, TaskStatus } from 'src/utils/types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

export type TaskStatusAndSequence = {
  status: TaskStatus;
  sequence: number;
};
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Auth(Role.PM)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Response<Task>> {
    const data = await this.taskService.create(createTaskDto);
    return {
      message: 'Task created successfully',
      error: false,
      data,
    };
  }

  //get task with id
  @Auth(Role.PM, Role.Member)
  @Get('/:id')
  async getTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Task>> {
    const data = await this.taskService.getTask(id);
    return {
      message: 'Get task  successfully',
      error: false,
      data,
    };
  }

  // update task
  @Auth(Role.PM, Role.Member, Role.Admin)
  @Put('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Response<Task>> {
    const data = await this.taskService.updateTask(id, updateTaskDto);
    return {
      message: `Task updated successfully`,
      error: false,
      data,
    };
  }
  //update task status
  @Auth(Role.PM, Role.Member, Role.Admin)
  @Put('/:id/status')
  async updateTaskStatusAndSequence(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTask: TaskStatusAndSequence,
  ): Promise<Response<Task>> {
    const data = await this.taskService.updateTaskStatusAndSequence(
      id,
      updateTask,
    );
    return {
      message: 'Task status updated successfully',
      error: false,
      data,
    };
  }
}
