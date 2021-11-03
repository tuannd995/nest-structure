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
