export interface CreateTaskAssigneeProps {
  id: string;
  taskId: string;
  userId: string;
  assignedAt?: Date;
}

export class TaskAssignee {
  private constructor(
    private _id: string,
    private _taskId: string,
    private _userId: string,
    private _assignedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get taskId(): string {
    return this._taskId;
  }

  get userId(): string {
    return this._userId;
  }

  get assignedAt(): Date {
    return this._assignedAt;
  }

  static createNew(
    props: Omit<CreateTaskAssigneeProps, 'assignedAt'>,
  ): TaskAssignee {
    return new TaskAssignee(props.id, props.taskId, props.userId, new Date());
  }

  static rehydrate(props: CreateTaskAssigneeProps): TaskAssignee {
    return new TaskAssignee(
      props.id,
      props.taskId,
      props.userId,
      props.assignedAt ?? new Date(),
    );
  }
}
