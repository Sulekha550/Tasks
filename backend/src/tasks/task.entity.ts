import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ default: '' }) description: string;
  @Column() status: string;
  @Column({ default: 'No Priority' }) priority: string;
  @Column({ default: 'Admin' }) member: string;
  @Column({ default: 'Admin' }) reporter: string;
  @Column({ default: '' }) dueDate: string;
  @Column({ default: '' }) projectId: string;
  @Column('simple-json', { default: '[]' }) labels: string[];
  @Column('simple-json', { default: '[]' }) subtasks: any[];
  @Column('simple-json', { default: '[]' }) comments: any[];
  @Column({ default: () => 'CURRENT_TIMESTAMP' }) createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' }) updatedAt: Date;
}
