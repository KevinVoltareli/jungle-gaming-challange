import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskPriority } from "../../../../domain/task/task-priority-enum";
import { TaskStatus } from "../../../../domain/task/task-status.enum";
import { CommentOrmEntity } from "./comment.orm-entity";
import { TaskHistoryOrmEntity } from "./task-history.orm-entity";
import { TaskAssigneeOrmEntity } from "./task-assignee.orm-entity";

@Entity({ name: "tasks" })
export class TaskOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "due_date", type: "timestamptz", nullable: true })
  dueDate!: Date | null;

  @Column({ type: "varchar" })
  priority!: TaskPriority;

  @Column({ type: "varchar" })
  status!: TaskStatus;

  @Column({ name: "creator_id" })
  creatorId!: string;

  @OneToMany(() => CommentOrmEntity, (comment) => comment.task, {
    cascade: false,
  })
  comments!: CommentOrmEntity[];

  @OneToMany(() => TaskHistoryOrmEntity, (history) => history.task, {
    cascade: false,
  })
  history!: TaskHistoryOrmEntity[];

  @OneToMany(() => TaskAssigneeOrmEntity, (assignee) => assignee.task, {
    cascade: false,
  })
  assignees!: TaskAssigneeOrmEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
