export interface IEventPublisher {
  /**
   * Publica um evento de domínio para o barramento (RabbitMQ).
   * @param event nome do evento (ex: 'task.created')
   * @param payload dados do evento
   */
  publish(event: string, payload: any): Promise<void>;
}
