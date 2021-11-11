import { UpdateTaskDto } from './dto/update-task.dto';
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
import { TaskStatusAndSequence } from './task.controller';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // find tasks with status and projectId
  async getTasksByStatusAndProjectId(status: TaskStatus, projectId: number) {
    return await this.taskRepository.find({
      where: {
        status,
        projectId,
      },
      order: {
        sequence: 'DESC',
      },
    });
  }
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
    const tasks = await this.getTasksByStatusAndProjectId(
      createTaskDto.status,
      createTaskDto.projectId,
    );

    const sequence = tasks.length > 0 ? tasks[0].sequence + 1 : 1;

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      sequence,
    });

    return await this.taskRepository.save(newTask);
  }

  // get list tasks in project with project id
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

    const tasks = await query.orderBy('task.sequence', 'ASC').getMany();

    if (!tasks || !tasks.length) {
      throw new NotFoundException('No tasks found in project');
    }

    return tasks;
  }
  // get task with id
  async getTask(id: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      },
      relations: ['assignTo'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
  // update task
  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = this.taskRepository.merge(task, updateTaskDto);

    return await this.taskRepository.save(updatedTask);
  }

  // update task status
  async updateTaskStatusAndSequence(
    id: number,
    updateTask: TaskStatusAndSequence,
  ) {
    const { status, sequence } = updateTask;

    const currentTask = await this.taskRepository.findOne(id);

    if (!currentTask) {
      throw new NotFoundException('Task not found');
    }

    // find tasks with the same status and projectId
    const tasksWithNewStatus = await this.getTasksByStatusAndProjectId(
      status,
      currentTask.projectId,
    );

    const tasksWithOldStatus = await this.getTasksByStatusAndProjectId(
      currentTask.status,
      currentTask.projectId,
    );

    // if task not change status
    if (currentTask.status === status) {
      // find task with sequence  = sequence
      // move task to the bot of column
      if (sequence === tasksWithOldStatus.length && currentTask.sequence == 1) {
        tasksWithOldStatus.forEach((task) => {
          task.sequence = task.sequence - 1;
        });
        const updatedTask = this.taskRepository.merge(currentTask, {
          sequence,
        });
        await this.taskRepository.save(tasksWithOldStatus);
        await this.taskRepository.save(updatedTask);
        return await this.taskRepository.save(updatedTask);
      } else {
        const taskWithSequence = tasksWithOldStatus.find(
          (t) => t.sequence === sequence,
        );

        if (taskWithSequence) {
          taskWithSequence.sequence = currentTask.sequence;
          await this.taskRepository.save(taskWithSequence);
        }

        const updatedTask = this.taskRepository.merge(currentTask, {
          sequence,
        });

        return await this.taskRepository.save(updatedTask);
      }
      // if task change status
    } else {
      const updatedTask = this.taskRepository.merge(currentTask, {
        status,
        sequence,
      });
      //remove current task from tasks with old status

      tasksWithOldStatus.length > 0 &&
        tasksWithOldStatus.forEach(
          (task) => task.sequence > 1 && (task.sequence = task.sequence - 1),
        );
      tasksWithOldStatus.splice(
        tasksWithOldStatus.findIndex((t) => t.id === currentTask.id),
        1,
      );

      await this.taskRepository.save(tasksWithOldStatus);

      tasksWithNewStatus.length > 0 &&
        tasksWithNewStatus.forEach((task) => {
          if (task.sequence >= sequence) {
            task.sequence = task.sequence + 1;
          }
        });
      await this.taskRepository.save(tasksWithNewStatus);

      return await this.taskRepository.save(updatedTask);
    }
  }
  // get all task of user with id user id
  async getTasksByUserId(userId: number) {
    return await this.taskRepository.find({
      where: {
        assignToId: userId,
      },
    });
  }
}
