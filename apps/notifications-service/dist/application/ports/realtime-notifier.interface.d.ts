export interface IRealtimeNotifier {
    notifyUser(userId: string, event: string, payload: any): Promise<void>;
}
