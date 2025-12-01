export interface IRealtimeNotifier {
  /**
   * Envia um evento realtime para um usuário específico.
   * @param userId ID do usuário
   * @param event nome do evento (ex: 'task:created')
   * @param payload dados do evento
   */
  notifyUser(userId: string, event: string, payload: any): Promise<void>;
}
