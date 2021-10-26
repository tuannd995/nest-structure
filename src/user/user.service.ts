import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Brackets, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterDto } from './dto/filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { convertAvatarToPath, removeImageInServer } from './functions';

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
    createUserDto.password = await hash('111111', 10);

    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;
  }

  // find all user
  async getUsers(filter: FilterDto) {
    const { page, limit, keyword, dob, role, status } = filter;
    const startIndex = (page - 1) * limit;

    const userList = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role like :role')
      .andWhere('user.dateOfBirth like :dob')
      .andWhere('user.status like :status')
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName like :firstName')
            .orWhere('user.lastName like :lastName')
            .orWhere('user.username like :username')
            .orWhere('user.email like :email');
        }),
      )
      .skip(startIndex)
      .take(limit)
      .setParameters({
        role: `%${role ? role : ''}%`,
        firstName: `%${keyword ? keyword : ''}%`,
        lastName: `%${keyword ? keyword : ''}%`,
        username: `%${keyword ? keyword : ''}%`,
        email: `%${keyword ? keyword : ''}%`,
        status: `%${status ? status : ''}%`,
        dob: `%${dob ? dob : ''}%`,
      })
      .getMany();

    const pagination: PaginationDto = {
      page: page,
      total: userList.length,
      limit: limit,
      lastPage: Math.ceil(userList.length / limit),
    };
    if (!userList) {
      throw new NotFoundException();
    }

    return {
      userList,
      pagination,
    };
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
      const pass = await hash('111111', 10);
      _users.forEach(async (user) => (user.password = pass));
      return this.userRepository.save(_users);
    }
    throw new BadRequestException('Request must be a list');
  }
}
