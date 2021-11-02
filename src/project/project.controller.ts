import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { Response } from 'src/utils/types';
import { User as UserEntity } from '../user/entities/user.entity';
import { FilterDto } from './dto/filter.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(
    @Query() filterDto: FilterDto,
    @User() user: UserEntity,
  ): Promise<Response<Project[]>> {
    filterDto.page = Number(filterDto.page || 1);
    filterDto.limit = Number(filterDto.limit || 10);
    const result = await this.projectService.getProjects(user, filterDto);
    return {
      message: 'Get list projects successfully',
      error: false,
      data: result.projects,
      pagination: result.pagination,
    };
  }
}
