import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { Project } from './projects/project.entity';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'tasks.sqlite',
      entities: [Task, Project],
      synchronize: true
    }),
    TasksModule,
    ProjectsModule,
    AuthModule
  ]
})
export class AppModule {}
