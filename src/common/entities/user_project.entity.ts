import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('users__projects')
export class UserProject {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', nullable: false })
  userId: number;
  @PrimaryColumn({ name: 'project_id', type: 'bigint', nullable: false })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.members, { eager: true })
  @JoinColumn({ name: 'project_id' })
  public project!: Project;
  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  @JoinColumn({ name: 'user_id' })
  public user!: User;
}
