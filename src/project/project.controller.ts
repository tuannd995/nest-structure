import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Response, Role } from 'src/utils/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { User as UserEntity } from '../user/entities/user.entity';
import { FilterDto } from './dto/filter.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { TaskFilterDto } from 'src/task/dto/filter.dto';
import { Task } from 'src/task/entities/task.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(
    @Query() filterDto: FilterDto,
    @User() user: UserEntity,
  ): Promise<Response<Project[]>> {
    if (filterDto && Object.keys(filterDto).length > 0) {
      filterDto.page = Number(filterDto.page || 1);
      filterDto.limit = Number(filterDto.limit || 10);
    }

    const result = await this.projectService.getProjects(user, filterDto);
    return {
      message: 'Get project list successfully',
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
    if (project.memberIds) {
      project.memberIds = Array.from(project.memberIds, (x) =>
        Number(x),
      ).filter((x) => !isNaN(x));
    }
    const data = await this.projectService.createProject(project);

    return {
      message: 'Create project successfully',
      error: false,
      data,
    };
  }
  @Get('/:id')
  async getProject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Project>> {
    const data = await this.projectService.getProjectById(id);
    return {
      message: 'Get project successfully',
      error: false,
      data,
    };
  }

  @Get('/:id/tasks')
  async getProjectTasks(
    @Param('id', ParseIntPipe) id: number,
    @Query() filterDto: TaskFilterDto,
  ): Promise<Response<Task[]>> {
    // statues [1,2] :string to array number
    filterDto.statuses = Array.from(filterDto.statuses, (x) =>
      Number(x),
    ).filter((x) => !isNaN(x));
    const data = await this.projectService.getProjectTasks(filterDto, id);
    return {
      message: 'Get project tasks successfully',
      error: false,
      data,
    };
  }
  // edit project
  @Auth(Role.Admin, Role.PM)
  @Put(':id')
  async editProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.editProject(id, updateDto);
    return {
      message: 'Edit project successfully',
      error: false,
      data,
    };
  }

  // import project
  @Auth(Role.Admin)
  @Post('/imports')
  async importProjects(
    @Body() project: CreateProjectDto[],
  ): Promise<Response<Project[]>> {
    return await this.projectService.createProjects(project);
  }
}
