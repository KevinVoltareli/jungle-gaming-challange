import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskOrmEntity } from './task.orm-entity';

@Entity({ name: 'task_history' })
export class TaskHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'task_id' })
  taskId!: string;

  @ManyToOne(() => TaskOrmEntity, (task) => task.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task!: TaskOrmEntity;

  @Column({ type: 'varchar' })
  field!: string;

  @Column({ name: 'old_value', type: 'text' })
  oldValue!: string;

  @Column({ name: 'new_value', type: 'text' })
  newValue!: string;

  @Column({ name: 'changed_by_user_id' })
  changedByUserId!: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt!: Date;
}
