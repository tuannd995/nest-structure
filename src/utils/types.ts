import { PaginationDto } from './../user/dto/pagination.dto';
export enum Role {
  Admin = 'admin',
  PM = 'pm',
  Member = 'member',
}

export type Response = {
  message: string;
  error: boolean;
  data: any;
  paginationObj?: PaginationDto;
};
