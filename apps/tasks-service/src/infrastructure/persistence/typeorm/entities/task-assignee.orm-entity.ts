import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskOrmEntity } from './task.orm-entity';

@Entity({ name: 'task_assignees' })
export class TaskAssigneeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'task_id' })
  taskId!: string;

  @ManyToOne(() => TaskOrmEntity, (task) => task.assignees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task!: TaskOrmEntity;

  @Column({ name: 'user_id' })
  userId!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}
