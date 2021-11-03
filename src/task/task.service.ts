import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from 'src/utils/types';
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

    if (!createTaskDto.status) {
      createTaskDto.status = TaskStatus.Unscheduled;
    }

    // find tasks with the same status and projectId
    const tasks = await this.taskRepository.find({
      where: {
        status: createTaskDto.status,
        projectId: createTaskDto.projectId,
      },
      order: {
        sequence: 'DESC',
      },
    });

    const sequence = tasks.length > 0 ? tasks[0].sequence + 1 : 1;

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      sequence,
    });

    return await this.taskRepository.save(newTask);
  }
}
