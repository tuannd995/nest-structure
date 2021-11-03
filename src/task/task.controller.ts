import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Response, Role } from 'src/utils/types';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

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
}
