import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { CommentDto, CreateTaskDto, SubtaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
    @InjectRepository(Project) private readonly projects: Repository<Project>
  ) {}

  async seed() {
    // Keep existing user-created data. Only make sure the Figma sample
    // task exists so the Task Detail flow is always available.
    let createdProjects = await this.projects.find({ order: { name: 'ASC' } });

    if (!createdProjects.length) {
      createdProjects = await this.projects.save([
        { name: 'Website Redesign', color: '#7B61FF', description: 'Product website and design system', lead: 'Admin', priority: 'High', dueDate: '12 Sep 2026' },
        { name: 'Product Launch', color: '#FF9F43', description: 'Launch planning and execution', lead: 'CN', priority: 'Low', dueDate: '15 Sep 2026' },
        { name: 'Engineering', color: '#2D9CDB', description: 'Core platform work', lead: 'Admin', priority: 'Medium', dueDate: '18 Sep 2026' }
      ]);
    }

    const existingSample = await this.repo.findOne({
      where: { title: 'Write API Documentation' }
    });

    if (existingSample) return;

    const p = createdProjects[0];

    await this.repo.save({
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics effectively.',
      status: 'To Do',
      priority: 'High',
      member: 'Admin',
      reporter: 'Admin',
      dueDate: '29 Jul',
      projectId: p.id,
      labels: ['Deployment'],
      subtasks: [
        { id: randomUUID(), title: 'Subtask 1', priority: 'High', member: 'Admin', dueDate: '12 Sep 2026' },
        { id: randomUUID(), title: 'Subtask 2', priority: 'Low', member: 'CN', dueDate: '15 Sep 2026' },
        { id: randomUUID(), title: 'Subtask 3', priority: 'Medium', member: 'Admin', dueDate: '18 Sep 2026' }
      ],
      comments: [
        {
          id: randomUUID(),
          author: 'Ankit Dutta',
          body: 'dsds',
          createdAt: new Date().toISOString()
        }
      ]
    });
  }

  async findAll() { await this.seed(); return this.repo.find({ order: { createdAt: 'DESC' } }); }

  async create(dto: CreateTaskDto) { await this.seed(); return this.repo.save(this.repo.create(dto)); }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.repo.preload({ id, ...dto });
    if (!task) throw new NotFoundException('Task not found');
    return this.repo.save(task);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }

  async comment(id: string, dto: CommentDto) {
    const task = await this.repo.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    task.comments = [...(task.comments || []), { id: randomUUID(), author: dto.author || 'Ankit Dutta', body: dto.body, createdAt: new Date().toISOString() }];
    return this.repo.save(task);
  }

  async subtask(id: string, dto: SubtaskDto) {
    const task = await this.repo.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    task.subtasks = [...(task.subtasks || []), { id: randomUUID(), title: dto.title, priority: dto.priority || 'No Priority', member: dto.member || 'Admin', dueDate: dto.dueDate || '' }];
    return this.repo.save(task);
  }
}
