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
exports.ListCommentsService = void 0;
const common_1 = require("@nestjs/common");
let ListCommentsService = class ListCommentsService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(input) {
        const page = input.page > 0 ? input.page : 1;
        const size = input.size > 0 ? input.size : 10;
        const result = await this.commentRepository.findByTask({
            taskId: input.taskId,
            page,
            size,
        });
        return {
            items: result.items.map((comment) => ({
                id: comment.id,
                authorId: comment.authorId,
                content: comment.content,
                createdAt: comment.createdAt,
            })),
            total: result.total,
            page,
            size,
        };
    }
};
exports.ListCommentsService = ListCommentsService;
exports.ListCommentsService = ListCommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ICommentRepository")),
    __metadata("design:paramtypes", [Object])
], ListCommentsService);
//# sourceMappingURL=list-comments.service.js.map