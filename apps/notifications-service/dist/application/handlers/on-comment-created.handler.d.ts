import { INotificationRepository } from "../../domain/notification/notification-repository.interface";
import { IIdGenerator } from "../ports/id-generator.interface";
import { IRealtimeNotifier } from "../ports/realtime-notifier.interface";
interface TaskCommentCreatedEventPayload {
    commentId: string;
    taskId: string;
    authorId: string;
    content: string;
    createdAt: string;
    participantUserIds?: string[];
}
export declare class OnCommentCreatedHandler {
    private readonly notificationRepo;
    private readonly idGenerator;
    private readonly realtimeNotifier;
    private readonly logger;
    constructor(notificationRepo: INotificationRepository, idGenerator: IIdGenerator, realtimeNotifier: IRealtimeNotifier);
    handle(payload: TaskCommentCreatedEventPayload): Promise<void>;
}
export {};
