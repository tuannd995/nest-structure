import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UsersProjects } from 'src/common/Entities/Users__Projects.entity';
import { TaskFilterDto } from 'src/task/dto/filter.dto';
import { TaskService } from 'src/task/task.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/utils/types';
import { Brackets, In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

export type ProjectResponse = Project & {
  members?: User[];
};

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UsersProjects)
    private readonly usersProjectsRepository: Repository<UsersProjects>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {}

  //get all project of user
  async getProjects(user: User, filter: FilterDto) {
    const { page, limit, keyword, status, endDate } = filter;

    const query = this.projectRepository.createQueryBuilder('project');

    if (user.role === Role.Member) {
      query.innerJoinAndSelect(
        'project.members',
        'members',
        'members.id = :userId',
        { userId: user.id },
      );
    } else {
      query.leftJoinAndSelect('project.members', 'members');
    }

    if (user.role === Role.PM) {
      query.where('project.pmId = :userId', { userId: user.id });
    }
    if (status) {
      query.andWhere('project.status = :status', { status });
    }
    if (endDate) {
      query.andWhere('project.endDate = :endDate', { endDate });
    }

    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(`project.name like :keyword`, { keyword: `%${keyword}%` })
            .orWhere(`project.description like :keyword`, {
              keyword: `%${keyword}%`,
            })
            .orWhere(`project.client like :keyword`, {
              keyword: `%${keyword}%`,
            });
        }),
      );
    }

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      query.skip(startIndex).take(limit);
      const projects = await query.getMany();
      const total = await query.getCount();
      const pagination: PaginationDto = {
        page,
        total,
        limit,
        lastPage: Math.ceil(total / limit),
      };
      if (!projects) {
        throw new NotFoundException('User does not have any projects');
      }
      return {
        projects,
        pagination,
      };
    } else {
      const projects = await query.getMany();

      if (!projects || !projects.length) {
        throw new NotFoundException('User does not have any projects');
      }

      return {
        projects,
      };
    }
  }

  // create project
  async createProject(createProjectDto: CreateProjectDto) {
    const {
      name,
      description,
      pmId,
      client,
      startDate,
      endDate,
      memberIds,
      status,
    } = createProjectDto;

    // check project is exits or not by name
    const projectExits = await this.projectRepository.findOne({
      where: { name },
    });

    if (projectExits) {
      throw new BadRequestException('Project is exits');
    }

    const project = new Project();
    project.name = name;
    project.description = description;
    project.client = client;
    project.startDate = startDate;
    project.endDate = endDate;
    project.pmId = pmId;
    project.status = status;

    await this.projectRepository.save(project);
    if (memberIds) {
      for (const memberId of memberIds) {
        await this.usersProjectsRepository.insert({
          user_id: memberId,
          project_id: project.id,
        });
      }
    }
    return project;
  }

  // get project by id
  async getProjectById(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['pm', 'members'],
    });

    if (!project) {
      throw new NotFoundException('Project does not exist');
    }
    return project;
  }

  // get tasks of project by id project
  async getProjectTasks(filterDto: TaskFilterDto, id: number) {
    return await this.taskService.getTasksInProject(filterDto, id);
  }
  // edit project
  async editProject(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.getProjectById(id);

    if (updateProjectDto.name !== project.name) {
      const projectExits = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name },
      });
      if (projectExits) {
        throw new BadRequestException('Project name is exits');
      }
    }
    const _project = this.projectRepository.merge(project, updateProjectDto);

    return await this.projectRepository.save(_project);
  }

  // get projects of user by id when user is PM or Member of project
  async getProjectsByUserId(userId: number) {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'members')
      .where('pm_id = :userId', { userId })
      .orWhere('members.id = :userId', { userId })
      .getMany();
  }
  // create multiple project by excel file
  async createProjects(createProjectDto: CreateProjectDto[]) {
    const projectExits = await this.projectRepository.find({
      where: { name: In(createProjectDto.map((project) => project.name)) },
    });
    if (projectExits.length) {
      return {
        message: 'Projects is exits',
        data: projectExits,
        error: true,
      };
    }
    const projects = await this.projectRepository.save(createProjectDto);
    return {
      message: 'Import successfully',
      data: projects,
      error: false,
    };
  }
}
