import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { ProjectService } from 'src/project/project.service';
import { TaskService } from 'src/task/task.service';
import { Brackets, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterDto } from './dto/filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  convertAvatarToPath,
  createUploadFolder,
  generatePassword,
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
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
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
    createUserDto.password = generatePassword();

    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    await this.mailService.sendMail(createUserDto as User);
    delete user.password;
    return user;
  }

  // find all user
  async getUsers(filter: FilterDto) {
    const { page, limit, keyword, dob, role, status } = filter;

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
          qb.where(`user.firstName like :keyword`, {
            keyword: `%${keyword}%`,
          })
            .orWhere(`user.lastName like :keyword`, {
              keyword: `%${keyword}%`,
            })
            .orWhere(`user.username like :keyword`, {
              keyword: `%${keyword}%`,
            })
            .orWhere(`user.email like :keyword`, { keyword: `%${keyword}%` });
        }),
      );
    }
    if (limit) {
      const currentPage = page || 1;
      const startIndex = (currentPage - 1) * limit;
      const total = await queryBuilder.getCount();
      const users = await queryBuilder.skip(startIndex).take(limit).getMany();
      const pagination: PaginationDto = {
        page: currentPage,
        total,
        limit: limit,
        lastPage: Math.ceil(total / limit),
      };
      return { users, pagination };
    } else {
      const users = await queryBuilder.getMany();
      return {
        users,
      };
    }
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

      // send mail
      _users.forEach(async (user) => {
        user.password = generatePassword();
        await this.mailService.sendMail(user as User);
      });

      return await this.userRepository.save(_users);
    }
    throw new BadRequestException('Request must be a list');
  }

  // change password user
  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const { password, confirmPass, currentPass } = changePasswordDto;
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User does not exits');
    }

    const isMatch = await compare(currentPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is not correct');
    }
    if (password !== confirmPass) {
      throw new BadRequestException(
        'New password and confirm password not match',
      );
    }

    const _user = this.userRepository.merge(user, { password });

    return await this.userRepository.save(_user);
  }
  // get all task of user
  async getUserTasks(userId: number) {
    return await this.taskService.getTasksByUserId(userId);
  }

  // get all projects of user
  async getUserProjects(userId: number) {
    return await this.projectService.getProjectsByUserId(userId);
  }
}
