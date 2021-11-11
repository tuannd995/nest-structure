import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { Response, Role } from 'src/utils/types';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(Role.Admin)
  @Get()
  async getUsers(
    @Query() filterDto: FilterDto,
  ): Promise<Response<UserEntity[]>> {
    filterDto.page = Number(filterDto.page);
    filterDto.limit = Number(filterDto.limit);

    const result = await this.userService.getUsers(filterDto);
    return {
      message: 'Get user lists successfully',
      error: false,
      data: result.users,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<UserEntity>> {
    const data = await this.userService.getOneUser(id);
    return {
      message: 'Get user successfully',
      error: false,
      data,
    };
  }

  @Auth(Role.Admin)
  @Post()
  async createOneUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Response<UserEntity>> {
    const data = await this.userService.createOneUser(createUserDto);

    return {
      message: 'User created',
      error: false,
      data,
    };
  }

  @Auth(Role.Admin, Role.Member, Role.PM)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response<UserEntity>> {
    const data = await this.userService.update(id, updateUserDto);

    return {
      message: `Updated user with id ${id}`,
      error: false,
      data,
    };
  }

  @Auth(Role.Admin)
  @Delete('/deleteMany')
  async removeUsers(@Body() ids: number[]): Promise<Response<UserEntity[]>> {
    const data = await this.userService.removeUsers(ids);
    return {
      message: 'Remove users successfully',
      error: false,
      data,
    };
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<UserEntity>> {
    const data = await this.userService.remove(id);
    return {
      message: `Deleted user with id ${id}`,
      error: false,
      data,
    };
  }

  @Auth(Role.Admin)
  @Post('/import')
  async importUsers(
    @Body() users: CreateUserDto[],
  ): Promise<Response<UserEntity[]>> {
    const data = await this.userService.importUsers(users);
    return {
      message: 'Import users successfully',
      error: false,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Auth(Role.Admin, Role.Member, Role.PM)
  @Put('/:id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePassDto: ChangePasswordDto,
  ): Promise<Response<UserEntity>> {
    const data = await this.userService.changePassword(id, changePassDto);
    return {
      message: 'Change password successfully',
      error: false,
      data,
    };
  }
  // get task of user
  @Get('/:id/tasks')
  async getUserTasks(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Task[]>> {
    const data = await this.userService.getUserTasks(id);
    return {
      message: 'Get user tasks successfully',

      error: false,
      data,
    };
  }
  // get projects of user
  @Get('/:id/projects')
  async getUserProjects(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<Project[]>> {
    const data = await this.userService.getUserProjects(id);
    return {
      message: 'Get user projects successfully',
      error: false,
      data,
    };
  }
}
