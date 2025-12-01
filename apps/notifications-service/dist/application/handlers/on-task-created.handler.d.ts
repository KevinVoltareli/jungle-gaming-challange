import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";
interface TaskCreatedEventPayload {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    priority: string;
    status: string;
    creatorId: string;
    assigneeUserIds?: string[];
    createdAt: string;
}
export declare class OnTaskCreatedHandler {
    private readonly notificationRepo;
    private readonly idGenerator;
    private readonly realtimeNotifier;
    private readonly logger;
    constructor(notificationRepo: INotificationRepository, idGenerator: IIdGenerator, realtimeNotifier: IRealtimeNotifier);
    handle(payload: TaskCreatedEventPayload): Promise<void>;
}
export {};
