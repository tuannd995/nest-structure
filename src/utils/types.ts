import { PaginationDto } from '../common/dto/pagination.dto';
export enum Role {
  Admin = 'admin',
  PM = 'pm',
  Member = 'member',
}

export enum ProjectStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export type Response<T = any> = {
  message: string;
  error: boolean;
  data: T;
  pagination?: PaginationDto;
};

export enum TaskStatus {
  Unscheduled = 1,
  Doing = 2,
  Reviewing = 3,
  Completed = 4,
  Cancelled = 5,
}
export enum TaskPriority {
  High = 1,
  Medium = 2,
}
