import { TaskAssignee } from './task-assignee.entity';

export interface ITaskAssigneeRepository {
  findByTask(taskId: string): Promise<TaskAssignee[]>;

  /**
   * Substitui todos os responsáveis de uma tarefa por uma nova lista.
   * (mais simples de usar no caso de "atribuir múltiplos usuários")
   */
  replaceAssignees(taskId: string, assignees: TaskAssignee[]): Promise<void>;
}
