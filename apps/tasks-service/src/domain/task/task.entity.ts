import { TaskTitle } from "./value-objects/task-title.vo";
import { TaskDescription } from "./value-objects/task-description.vo";
import { TaskPriority } from "./task-priority-enum";
import { TaskStatus } from "./task-status.enum";
import { TaskAssignee } from "./task-assignee.entity";
import { Comment } from "./comment.entity";
import { TaskHistory } from "./task-history.entity";

export interface CreateTaskProps {
  id: string;
  title: TaskTitle;
  description: TaskDescription;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  assignees?: TaskAssignee[];
  comments?: Comment[];
  history?: TaskHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private _assignees: TaskAssignee[];
  private _comments: Comment[];
  private _history: TaskHistory[];

  private constructor(
    private _id: string,
    private _title: TaskTitle,
    private _description: TaskDescription,
    private _dueDate: Date | null,
    private _priority: TaskPriority,
    private _status: TaskStatus,
    private _creatorId: string,
    assignees: TaskAssignee[],
    comments: Comment[],
    history: TaskHistory[],
    private _createdAt: Date,
    private _updatedAt: Date
  ) {
    this._assignees = assignees;
    this._comments = comments;
    this._history = history;
  }

  // ========= GETTERS =========

  get id(): string {
    return this._id;
  }

  get title(): TaskTitle {
    return this._title;
  }

  get description(): TaskDescription {
    return this._description;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get creatorId(): string {
    return this._creatorId;
  }

  get assignees(): TaskAssignee[] {
    return [...this._assignees];
  }

  get comments(): Comment[] {
    return [...this._comments];
  }

  get history(): TaskHistory[] {
    return [...this._history];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ========= FACTORIES =========

  static createNew(
    props: Omit<CreateTaskProps, "createdAt" | "updatedAt">
  ): Task {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const assignees = props.assignees ?? [];
    const comments = props.comments ?? [];
    const history = props.history ?? [];

    return new Task(
      props.id,
      props.title,
      props.description,
      props.dueDate ?? null,
      props.priority,
      props.status,
      props.creatorId,
      assignees,
      comments,
      history,
      createdAt,
      updatedAt
    );
  }

  static rehydrate(props: CreateTaskProps): Task {
    return new Task(
      props.id,
      props.title,
      props.description,
      props.dueDate ?? null,
      props.priority,
      props.status,
      props.creatorId,
      props.assignees ?? [],
      props.comments ?? [],
      props.history ?? [],
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date()
    );
  }

  // ========= BEHAVIOUR =========

  changeTitle(newTitle: TaskTitle, changedByUserId: string): TaskHistory {
    const oldValue = this._title.value;
    this._title = newTitle;
    this.touch();

    const history = TaskHistory.forFieldChange({
      id: crypto.randomUUID(),
      taskId: this._id,
      field: "title",
      oldValue,
      newValue: newTitle.value,
      changedByUserId,
    });

    this._history.push(history);
    return history;
  }

  changeDescription(
    newDescription: TaskDescription,
    changedByUserId: string
  ): TaskHistory {
    const oldValue = this._description.value ?? "";
    this._description = newDescription;
    this.touch();

    const history = TaskHistory.forFieldChange({
      id: crypto.randomUUID(),
      taskId: this._id,
      field: "description",
      oldValue,
      newValue: newDescription.value ?? "",
      changedByUserId,
    });

    this._history.push(history);
    return history;
  }

  changePriority(
    newPriority: TaskPriority,
    changedByUserId: string
  ): TaskHistory {
    const oldValue = this._priority;
    this._priority = newPriority;
    this.touch();

    const history = TaskHistory.forFieldChange({
      id: crypto.randomUUID(),
      taskId: this._id,
      field: "priority",
      oldValue,
      newValue: newPriority,
      changedByUserId,
    });

    this._history.push(history);
    return history;
  }

  changeStatus(newStatus: TaskStatus, changedByUserId: string): TaskHistory {
    const oldValue = this._status;
    this._status = newStatus;
    this.touch();

    const history = TaskHistory.forFieldChange({
      id: crypto.randomUUID(),
      taskId: this._id,
      field: "status",
      oldValue,
      newValue: newStatus,
      changedByUserId,
    });

    this._history.push(history);
    return history;
  }

  addAssignee(assignee: TaskAssignee): void {
    const alreadyAssigned = this._assignees.some(
      (a) => a.userId === assignee.userId
    );

    if (!alreadyAssigned) {
      this._assignees.push(assignee);
      this.touch();
    }
  }

  addComment(comment: Comment): void {
    this._comments.push(comment);
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
