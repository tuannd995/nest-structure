import { Entity, PrimaryColumn } from 'typeorm';

@Entity('users__projects')
export class UsersProjects {
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;
  @PrimaryColumn({ type: 'bigint' })
  project_id: number;
}
