import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // create new task
  async create(createTaskDto: CreateTaskDto) {
    const taskExits = await this.taskRepository.findOne({
      where: {
        title: createTaskDto.title,
      },
    });

    if (taskExits) {
      throw new BadRequestException('Task already exists');
    }
    const newTask = this.taskRepository.create(createTaskDto);

    return await this.taskRepository.save(newTask);
  }
}
