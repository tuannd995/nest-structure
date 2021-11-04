import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from 'src/utils/types';
import { Brackets, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/filter.dto';
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

  // get list tasks
  async getTasksInProject(filterDto: TaskFilterDto, projectId: number) {
    const { statuses, keyword, priority, assignToId } = filterDto;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.requestByUser', 'requestByUser')
      .leftJoinAndSelect('task.assignTo', 'assignTo')
      .where('task.projectId = :projectId', { projectId });

    if (statuses && statuses.length > 0) {
      query.andWhere('task.status in (:...statuses)', { statuses });
    }

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }
    if (assignToId) {
      query.andWhere('task.assignToId = :assignToId', { assignToId });
    }

    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('task.title like :keyword', {
            keyword: `%${keyword}%`,
          }).orWhere('task.notes like :keyword', { keyword: `%${keyword}%` });
        }),
      );
    }

    const tasks = await query.orderBy('task.sequence', 'DESC').getMany();

    if (!tasks || !tasks.length) {
      throw new NotFoundException('No tasks found in project');
    }

    return tasks;
  }
}
