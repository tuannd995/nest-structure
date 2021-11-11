import { hashSync } from 'bcryptjs';
import { company, date, internet, lorem, name } from 'faker';
import { UsersProjects } from 'src/common/Entities/Users__Projects.entity';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { SALT_ROUNDS } from 'src/utils/constants';
import { ProjectStatus, Role, TaskPriority, TaskStatus } from 'src/utils/types';
import { QueryRunner } from 'typeorm';

const numOfUsers = 100;
const numOfProjects = 100;

// random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createMockUsers = async (query: QueryRunner) => {
  const userIds: number[] = [];
  userIds.push(
    (
      await query.manager.save(User, {
        username: 'admin',
        password: hashSync('111111', SALT_ROUNDS),
        email: 'duyhiep2519@gamil.com',
        firstName: 'Duy',
        lastName: 'Hiep',
        role: Role.Admin,
        status: 1,
      })
    ).id,
  );
  for (let i = 1; i < numOfUsers; i++) {
    const user = new User();
    user.firstName = name.firstName();
    user.lastName = name.lastName();
    user.username = user.lastName + i;
    user.email = internet.email(user.lastName + i);
    user.password = '111111';
    user.status = 1;
    if (i <= 21) {
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
    await createMockTasks(query, project);
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

const createMockTasks = async (
  query: QueryRunner,
  project: CreateProjectDto,
) => {
  const taskStatues: TaskStatus[] = [
    TaskStatus.Unscheduled,
    TaskStatus.Reviewing,
    TaskStatus.Doing,
    TaskStatus.Completed,
    TaskStatus.Cancelled,
  ];
  for (let i = 0; i < 10; i++) {
    const task = new Task();
    task.title =
      lorem.words().length > 20
        ? lorem.words().slice(0, 19) + i
        : lorem.words() + i;
    task.notes = lorem.sentence();
    task.status = taskStatues[randomNumber(0, taskStatues.length - 1)];
    task.projectId = project.id;
    task.requestById = project.pmId;
    task.assignToId =
      project.memberIds[randomNumber(0, project.memberIds.length - 1)];
    task.dueDate = date.future();
    task.priority = TaskPriority.Medium;
    await query.manager.save(Task, task);
  }
};
