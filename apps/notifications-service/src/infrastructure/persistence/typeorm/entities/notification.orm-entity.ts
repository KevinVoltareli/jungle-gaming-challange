import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "notifications" })
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ name: "type" })
  type!: string;

  // vamos armazenar payload como JSON
  @Column({ name: "payload", type: "jsonb" })
  payload!: any;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "read_at", type: "timestamp", nullable: true })
  readAt!: Date | null;
}
