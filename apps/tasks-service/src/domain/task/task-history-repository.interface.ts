import { TaskHistory } from './task-history.entity';

export interface ITaskHistoryRepository {
  findByTask(taskId: string): Promise<TaskHistory[]>;

  save(entry: TaskHistory): Promise<void>;
}
