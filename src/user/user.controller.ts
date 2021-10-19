import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async createOneUser(@Body() createUserDto: CreateUserDto) {
  //   // createUserDto.avatar = file.path;
  //   const data = await this.userService.createOneUser(createUserDto);

  //   return {
  //     message: 'User created',
  //     error: false,
  //     users: data,
  //   };
  // }
  // @Post('/import')
  // async importUsers(@Body() users: CreateUserDto[]) {
  //   const data = await this.userService.importUsers(users);
  //   return {
  //     message: 'Import users successfully',
  //     error: false,
  //     users: data,
  //   };
  // }

  // @Get()
  // async findAll() {
  //   const data = await this.userService.findAll();
  //   return {
  //     message: 'get user lists successfully',
  //     error: false,
  //     users: data,
  //   };
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.findOne({ id });
    return {
      message: 'get user info successfully',
      error: false,
      user: data,
    };
  }

  // @Put(':id')
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const data = await this.userService.update(id, updateUserDto);

  //   return {
  //     message: 'Updated',
  //     error: false,
  //     user: data,
  //   };
  // }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   const data = await this.userService.remove(id);
  //   return {
  //     message: `Deleted user with id ${id}`,
  //     error: false,
  //     user: data,
  //   };
  // }
}
