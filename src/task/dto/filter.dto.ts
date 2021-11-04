import { TaskStatus, TaskPriority } from 'src/utils/types';
export class TaskFilterDto {
  keyword?: string;
  assignToId?: number;
  requestById?: number;
  statuses?: TaskStatus[];
  priority?: TaskPriority;
  page?: number;
  limit?: number;
}
