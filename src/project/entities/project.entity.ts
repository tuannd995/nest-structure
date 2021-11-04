import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ name: 'name', type: 'varchar', nullable: false, unique: true })
  name: string;
  @Column({ name: 'client', type: 'varchar', nullable: false })
  client: string;
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;
  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;
  @Column({ name: 'status', type: 'tinyint', default: 1, nullable: false })
  status: number;
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'pm_id', type: 'bigint' })
  pmId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'pm_id' })
  pm: User;

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable({
    name: 'users__projects',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];

  // one to many relation with task entity (one project can have many tasks) (inverse side)
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
