import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Task } from '../tasks/task.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly repo: Repository<Project>, @InjectRepository(Task) private readonly tasks: Repository<Task>) {}

  async findAll() {
    let projects = await this.repo.find({ order: { name: 'ASC' } });
    if (!projects.length) {
      projects = await this.repo.save([
        { name: 'Website Redesign', color: '#7B61FF', description: 'Product website and design system' },
        { name: 'Product Launch', color: '#FF9F43', description: 'Launch planning and execution' },
        { name: 'Engineering', color: '#2D9CDB', description: 'Core platform work' }
      ]);
    }
    const tasks = await this.tasks.find();
    return projects.map(p => ({ ...p, taskCount: tasks.filter(t => t.projectId === p.id).length }));
  }

  async create(dto: CreateProjectDto) { return this.repo.save(this.repo.create(dto)); }

  async update(id: string, dto: UpdateProjectDto) {
    const p = await this.repo.preload({ id, ...dto });
    if (!p) throw new NotFoundException('Project not found');
    return this.repo.save(p);
  }

  async remove(id: string) {
    await this.tasks.update({ projectId: id }, { projectId: '' });
    await this.repo.delete(id);
    return { ok: true };
  }
}
