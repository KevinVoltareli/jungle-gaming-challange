export type TaskHistoryField =
  | 'title'
  | 'description'
  | 'priority'
  | 'status'
  | 'assignee'
  | 'dueDate';

export interface CreateTaskHistoryProps {
  id: string;
  taskId: string;
  field: TaskHistoryField;
  oldValue: string;
  newValue: string;
  changedByUserId: string;
  changedAt?: Date;
}

export class TaskHistory {
  private constructor(
    private _id: string,
    private _taskId: string,
    private _field: TaskHistoryField,
    private _oldValue: string,
    private _newValue: string,
    private _changedByUserId: string,
    private _changedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get taskId(): string {
    return this._taskId;
  }

  get field(): TaskHistoryField {
    return this._field;
  }

  get oldValue(): string {
    return this._oldValue;
  }

  get newValue(): string {
    return this._newValue;
  }

  get changedByUserId(): string {
    return this._changedByUserId;
  }

  get changedAt(): Date {
    return this._changedAt;
  }

  static forFieldChange(props: CreateTaskHistoryProps): TaskHistory {
    return new TaskHistory(
      props.id,
      props.taskId,
      props.field,
      props.oldValue,
      props.newValue,
      props.changedByUserId,
      props.changedAt ?? new Date(),
    );
  }

  static rehydrate(props: CreateTaskHistoryProps): TaskHistory {
    return new TaskHistory(
      props.id,
      props.taskId,
      props.field,
      props.oldValue,
      props.newValue,
      props.changedByUserId,
      props.changedAt ?? new Date(),
    );
  }
}
