import { hash } from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/utils/types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  username: string;
  @Column({
    name: 'email',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    nullable: false,
    select: false,
  })
  password: string;
  @Column({ name: 'avatar', type: 'longblob', nullable: true })
  avatar: any;
  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: false })
  firstName: string;
  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: false })
  lastName: string;
  @Column({ name: 'birth_date', type: 'date', nullable: true })
  dateOfBirth: Date;
  @Column({ name: 'role', type: 'enum', nullable: false, enum: Role })
  role: string;
  @Column({ name: 'status', type: 'tinyint', default: 1, nullable: false })
  status: number;
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await hash(this.password, 10);
  }
}
