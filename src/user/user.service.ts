import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { TaskService } from 'src/task/task.service';
import { SALT_ROUNDS } from 'src/utils/constants';
import { Brackets, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  convertAvatarToPath,
  createUploadFolder,
  removeImageInServer,
} from './functions';

interface UserFindData {
  id?: number;
  username?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
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
    createUploadFolder();

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
    createUserDto.password = await hash('111111', SALT_ROUNDS);

    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;
  }

  // find all user
  async getUsers(filter: FilterDto) {
    const { page, limit, keyword, dob, role, status } = filter;
    const startIndex = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (role) {
      queryBuilder.andWhere(`user.role like :role`, { role });
    }
    if (dob) {
      queryBuilder.andWhere(`user.dateOfBirth like :dob`, { dob });
    }
    if (status) {
      queryBuilder.andWhere(`user.status like :status`, { status });
    }
    if (keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`user.firstName like :keyword`, { keyword: `%${keyword}%` })
            .orWhere(`user.lastName like :keyword`, { keyword: `%${keyword}%` })
            .orWhere(`user.username like :keyword`, {
              keyword: `%${keyword}%`,
            })
            .orWhere(`user.email like :keyword`, { keyword: `%${keyword}%` });
        }),
      );
    }
    const total = await queryBuilder.getCount();
    const users = await queryBuilder.skip(startIndex).take(limit).getMany();

    const pagination: PaginationDto = {
      page: page,
      total,
      limit: limit,
      lastPage: Math.ceil(total / limit),
    };
    if (!users || !users.length) {
      throw new NotFoundException();
    }

    return {
      users,
      pagination,
    };
  }
  // update user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ id });
    createUploadFolder();
    if (updateUserDto.avatar && updateUserDto.avatar !== user.avatar) {
      if (user.avatar) removeImageInServer(user.avatar);
      updateUserDto.avatar = convertAvatarToPath(updateUserDto.avatar);
    }

    const editedUser = Object.assign(user, updateUserDto);
    editedUser.updatedAt = new Date();

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

  async findUsersWithIds(ids: number[]) {
    const users = await this.userRepository.findByIds(ids);
    if (!users) {
      throw new NotFoundException('Users does not exits');
    }
    return users;
  }

  // delete many user with list id
  async removeUsers(ids: number[]) {
    const users = await this.findUsersWithIds(ids);

    for (const user of users) {
      if (user.avatar) {
        removeImageInServer(user.avatar);
      }
    }
    return await this.userRepository.remove(users);
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
      const pass = await hash('111111', SALT_ROUNDS);
      _users.forEach(async (user) => (user.password = pass));
      return this.userRepository.save(_users);
    }
    throw new BadRequestException('Request must be a list');
  }
  // get all task of user
  async getUserTasks(userId: number) {
    const tasks = await this.taskService.getTasksByUserId(userId);
    if (!tasks || !tasks.length) {
      throw new NotFoundException('User does not have any tasks');
    }
    return tasks;
  }
}
