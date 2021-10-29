import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { IsNull, Like, Repository } from 'typeorm';
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
  ) {}

  async getProjects(filter: FilterDto) {
    const { page, limit, keyword, status, endDate } = filter;
    const startIndex = (page - 1) * limit;

    // const queryBuilder = this.projectRepository.createQueryBuilder('project');

    // if (endDate) {
    //   queryBuilder.andWhere(`project.endDate like :endDate`, { endDate });
    // }
    // if (status) {
    //   queryBuilder.andWhere(`project.status like :status`, { status });
    // }
    // if (keyword) {
    //   queryBuilder.andWhere(
    //     new Brackets((qb) => {
    //       qb.where(`project.name like :keyword`, { keyword: `%${keyword}%` })
    //         .orWhere(`project.description like :keyword`, {
    //           keyword: `%${keyword}%`,
    //         })
    //         .orWhere(`project.client like :keyword`, {
    //           keyword: `%${keyword}%`,
    //         });
    //     }),
    //   );
    // }

    // const projects = await queryBuilder
    //   .leftJoinAndSelect('project.pm', 'users')
    //   .leftJoinAndSelect('project.members', 'users__projects')
    //   .skip(startIndex)
    //   .take(limit)
    //   .getMany();
    // const total = await queryBuilder.getCount();
    const filterOption = [
      {
        name: Like(`%${keyword ? keyword : ''}%`),
        status: Like(`%${status ? status : ''}%`),
        endDate: endDate ? endDate : IsNull(),
      },
      {
        description: Like(`%${keyword ? keyword : ''}%`),
        status: Like(`%${status ? status : ''}%`),
        endDate: endDate ? endDate : IsNull(),
      },
      {
        client: Like(`%${keyword ? keyword : ''}%`),
        status: Like(`%${status ? status : ''}%`),
        endDate: endDate ? endDate : IsNull(),
      },
    ];

    const [projects, total] = await this.projectRepository.findAndCount({
      relations: ['pm', 'members'],
      where: filterOption,
    });

    if (!projects) {
      throw new NotFoundException();
    }

    const pagination: PaginationDto = {
      page: page,
      total,
      limit: limit,
      lastPage: Math.ceil(total / limit),
    };

    return {
      projects: projects,
      pagination,
    };
  }
}
