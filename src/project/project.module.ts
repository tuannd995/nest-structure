import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProjects } from 'src/common/Entities/Users__Projects.entity';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UsersProjects]),
    forwardRef(() => UserModule),
    forwardRef(() => TaskModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
