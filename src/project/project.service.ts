import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/utils/types';
import { Brackets, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { FilterDto } from './dto/filter.dto';
import { Project } from './entities/project.entity';

export type ProjectResponse = Project & {
  members?: User[];
};

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  //get all project of user
  async getProjects(user: User, filter: FilterDto) {
    const { page, limit, keyword, status, endDate } = filter;
    const startIndex = (page - 1) * limit;

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
      query.where('project.pm = :userId', { userId: user.id });
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

    const projects = await query.skip(startIndex).take(limit).getMany();
    const total = await query.getCount();

    if (!projects) {
      throw new NotFoundException('User does not have any projects');
    }

    const pagination: PaginationDto = {
      page,
      total,
      limit,
      lastPage: Math.ceil(total / limit),
    };

    return {
      projects: projects,
      pagination,
    };
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
    if (memberIds) {
      const users = await this.userService.findUsersWithIds(memberIds);
      project.members = users;
    }

    await this.projectRepository.save(project);
    return project;
  }
}
