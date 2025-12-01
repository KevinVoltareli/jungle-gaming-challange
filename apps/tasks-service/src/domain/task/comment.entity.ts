export interface CreateCommentProps {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt?: Date;
}

export class Comment {
  private constructor(
    private _id: string,
    private _taskId: string,
    private _authorId: string,
    private _content: string,
    private _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get taskId(): string {
    return this._taskId;
  }

  get authorId(): string {
    return this._authorId;
  }

  get content(): string {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  static createNew(props: Omit<CreateCommentProps, 'createdAt'>): Comment {
    if (!props.content || props.content.trim().length === 0) {
      throw new Error('Comment content is required.');
    }

    const content = props.content.trim();

    if (content.length > 1000) {
      throw new Error('Comment content must be at most 1000 characters.');
    }

    return new Comment(
      props.id,
      props.taskId,
      props.authorId,
      content,
      new Date(),
    );
  }

  static rehydrate(props: CreateCommentProps): Comment {
    return new Comment(
      props.id,
      props.taskId,
      props.authorId,
      props.content,
      props.createdAt ?? new Date(),
    );
  }
}
