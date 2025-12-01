"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTaskHistoryService = void 0;
const common_1 = require("@nestjs/common");
const task_history_entity_1 = require("../../../domain/task/task-history.entity");
let RegisterTaskHistoryService = class RegisterTaskHistoryService {
    constructor(historyRepository, idGenerator) {
        this.historyRepository = historyRepository;
        this.idGenerator = idGenerator;
    }
    async execute(input) {
        const history = task_history_entity_1.TaskHistory.forFieldChange({
            id: this.idGenerator.generate(),
            taskId: input.taskId,
            field: input.field,
            oldValue: input.oldValue,
            newValue: input.newValue,
            changedByUserId: input.changedByUserId,
        });
        await this.historyRepository.save(history);
    }
};
exports.RegisterTaskHistoryService = RegisterTaskHistoryService;
exports.RegisterTaskHistoryService = RegisterTaskHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ITaskHistoryRepository")),
    __param(1, (0, common_1.Inject)("IIdGenerator")),
    __metadata("design:paramtypes", [Object, Object])
], RegisterTaskHistoryService);
//# sourceMappingURL=register-task-history.service.js.map