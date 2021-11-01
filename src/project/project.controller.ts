import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Response, Role } from 'src/utils/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { FilterDto } from './dto/filter.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Auth(Role.Admin)
  @Get()
  async getProjects(
    @Query() filterDto: FilterDto,
  ): Promise<Response<Project[]>> {
    filterDto.page = Number(filterDto.page || 1);
    filterDto.limit = Number(filterDto.limit || 10);
    const result = await this.projectService.getProjects(filterDto);
    return {
      message: 'Get list projects successfully',
      error: false,
      data: result.projects,
      pagination: result.pagination,
    };
  }
  @Auth(Role.Admin)
  @Post()
  async createProject(
    @Body() project: CreateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.createProject(project);
    return {
      message: 'Create project successfully',
      error: false,
      data,
    };
  }
}
