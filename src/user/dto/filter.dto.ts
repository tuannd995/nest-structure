import { PaginationDto } from './pagination.dto';
export class FilterDto extends PaginationDto {
  keyword?: string;
  name?: string;
  dob?: string;
  role?: string;
  status?: number;
}
