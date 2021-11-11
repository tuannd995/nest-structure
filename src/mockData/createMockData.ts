import { hash } from 'bcryptjs';
import { company, internet, lorem, name } from 'faker';
import { UsersProjects } from 'src/common/Entities/Users__Projects.entity';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { SALT_ROUNDS } from 'src/utils/constants';
import { ProjectStatus, Role } from 'src/utils/types';
import { QueryRunner } from 'typeorm';

const numOfUsers = 100;
const numOfProjects = 100;

// random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createMockUsers = async (query: QueryRunner) => {
  const userIds: number[] = [];
  for (let i = 0; i < numOfUsers; i++) {
    const user = new User();
    user.firstName = name.firstName();
    user.lastName = name.lastName();
    user.username = user.lastName + i;
    user.email = internet.email(user.lastName + i);
    user.password = '111111';
    user.status = 1;
    if (i === 0) {
      user.role = Role.Admin;
    } else if (i <= 21) {
      user.role = Role.PM;
    } else {
      user.role = Role.Member;
    }
    userIds.push((await query.manager.save(User, user)).id);
  }
  await createMockProjects(query, userIds);
};

const createMockProjects = async (query: QueryRunner, userIds: number[]) => {
  for (let i = 0; i < numOfProjects; i++) {
    const memberId = randomNumber(22, userIds.length - 2);
    const project = new CreateProjectDto();
    project.name =
      name.jobTitle().length > 20
        ? name.jobTitle().slice(0, 19) + i
        : name.jobTitle() + i;
    project.client = company.companyName();
    project.description = lorem.sentence();
    project.status = ProjectStatus.Pending;
    project.pmId = userIds[randomNumber(1, 21)];
    project.memberIds = [memberId, memberId + 1, memberId + 2];
    await query.manager.save(Project, project);
    await createMockUsersProjects(query, project);
  }
};

const createMockUsersProjects = async (
  query: QueryRunner,
  project: CreateProjectDto,
) => {
  for (let i = 0; i < project.memberIds.length; i++) {
    query.manager.save(UsersProjects, {
      project_id: project.id,
      user_id: project.memberIds[i],
    });
  }
};
