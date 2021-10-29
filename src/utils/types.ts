import { PaginationDto } from '../common/dto/pagination.dto';
export enum Role {
  Admin = 'admin',
  PM = 'pm',
  Member = 'member',
}

export type Response<T = any> = {
  message: string;
  error: boolean;
  data: T;
  pagination?: PaginationDto;
};
