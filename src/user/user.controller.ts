import { FilterDto } from './dto/filter.dto';
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
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Response, Role } from 'src/utils/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(Role.Admin)
  @Get()
  async getUsers(@Query() filterDto: FilterDto): Promise<Response> {
    filterDto.page = Number(filterDto.page);
    filterDto.limit = Number(filterDto.limit);

    const result = await this.userService.getUsers({
      ...filterDto,
      limit: filterDto.limit > 10 ? 10 : filterDto.limit,
    });
    return {
      message: 'Get user lists successfully',
      error: false,
      data: result.userList,
      paginationObj: result.paginationObj,
    };
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<Response> {
    const data = await this.userService.getOneUser(id);
    return {
      message: 'Get user successfully',
      error: false,
      data: data,
    };
  }

  @Auth(Role.Admin)
  @Post()
  async createOneUser(@Body() createUserDto: CreateUserDto): Promise<Response> {
    const data = await this.userService.createOneUser(createUserDto);

    return {
      message: 'User created',
      error: false,
      data: data,
    };
  }

  @Auth(Role.Admin, Role.Member, Role.PM)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response> {
    const data = await this.userService.update(id, updateUserDto);

    return {
      message: `Updated user with id ${id}`,
      error: false,
      data: data,
    };
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Response> {
    const data = await this.userService.remove(id);
    return {
      message: `Deleted user with id ${id}`,
      error: false,
      data: data,
    };
  }

  @Auth(Role.Admin)
  @Post('/import')
  async importUsers(@Body() users: CreateUserDto[]): Promise<Response> {
    const data = await this.userService.importUsers(users);
    return {
      message: 'Import users successfully',
      error: false,
      data: data,
    };
  }
}
