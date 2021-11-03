import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ name: 'title', type: 'varchar', unique: true })
  title: string;
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;
  @Column({ name: 'priority', type: 'tinyint', default: 2, nullable: false })
  priority: number;
  @Column({ name: 'sequence', type: 'int', nullable: false })
  sequence: number;
  @Column({ name: 'status', type: 'tinyint', default: 1, nullable: false })
  status: number;
  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
  @Column({ name: 'assign_to_id', type: 'bigint', nullable: true })
  assignToId: number;
  @Column({ name: 'request_by_id', type: 'bigint' })
  requestById: number;
  @Column({ name: 'project_id', type: 'bigint' })
  projectId: number;
}
