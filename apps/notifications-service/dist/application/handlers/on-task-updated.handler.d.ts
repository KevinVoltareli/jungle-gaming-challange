import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";
interface TaskUpdatedEventPayload {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    priority: string;
    status: string;
    updatedAt: string;
    changedByUserId: string;
    assigneeUserIds?: string[];
}
export declare class OnTaskUpdatedHandler {
    private readonly notificationRepo;
    private readonly idGenerator;
    private readonly realtimeNotifier;
    private readonly logger;
    constructor(notificationRepo: INotificationRepository, idGenerator: IIdGenerator, realtimeNotifier: IRealtimeNotifier);
    handle(payload: TaskUpdatedEventPayload): Promise<void>;
}
export {};
