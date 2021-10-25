import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeImageInServer, convertAvatarToPath } from './functions';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

interface UserFindData {
  id?: number;
  username?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // find one user
  async findOne(data: UserFindData) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password') // get pass for compare
      .getOne();
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    return user;
  }
  // get one user
  async getOneUser(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    if (user.avatar) {
    }
    return user;
  }
  // creat one User
  async createOneUser(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (userExist) {
      throw new BadRequestException('Email or username  already exists');
    }
    if (createUserDto.avatar) {
      createUserDto.avatar = convertAvatarToPath(createUserDto.avatar);
    }

    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;
  }

  // find all user
  async findAll() {
    const userList = await this.userRepository.find();
    if (!userList) {
      throw new NotFoundException();
    }

    return userList;
  }
  // update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ id });
    if (updateUserDto.avatar && updateUserDto.avatar !== user.avatar) {
      if (user.avatar) removeImageInServer(user.avatar);
      updateUserDto.avatar = convertAvatarToPath(updateUserDto.avatar);
    }

    const editedUser = Object.assign(user, updateUserDto);
    editedUser.updatedAt = new Date();
    console.log({ editedUser });

    const _user = await this.userRepository.save(editedUser);
    delete _user.password;
    return _user;
  }
  // delete user
  async remove(id: number) {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User does not exits');
    }
    if (user.avatar) {
      removeImageInServer(user.avatar);
    }
    return await this.userRepository.remove(user);
  }

  // import
  async importUsers(users: CreateUserDto[]) {
    if (users instanceof Array) {
      const userList = await this.userRepository.find();
      const _users = users.filter(
        (user) => !userList.some((item) => item.username === user.username),
      );
      if (_users.length === 0) {
        throw new NotAcceptableException('All users already exist');
      }
      return this.userRepository.save(_users);
    }
    throw new BadRequestException('Request must be a list');
  }
}
