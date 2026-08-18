import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() color: string;
  @Column({ default: '' }) description: string;
  @Column({ default: 'Admin' }) lead: string;
  @Column({ default: 'High' }) priority: string;
  @Column({ default: '' }) dueDate: string;
}
