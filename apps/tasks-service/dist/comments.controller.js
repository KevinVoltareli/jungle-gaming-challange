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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const create_comment_service_1 = require("./application/use-cases/comments/create-comment.service");
const list_comments_service_1 = require("./application/use-cases/comments/list-comments.service");
let CommentsController = class CommentsController {
    constructor(createCommentService, listCommentsService) {
        this.createCommentService = createCommentService;
        this.listCommentsService = listCommentsService;
    }
    async create(taskId, dto) {
        return this.createCommentService.execute({ taskId, ...dto });
    }
    async list(taskId, query) {
        return this.listCommentsService.execute({ taskId, ...query });
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)("taskId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)("taskId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "list", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)("tasks/:taskId/comments"),
    __metadata("design:paramtypes", [create_comment_service_1.CreateCommentService,
        list_comments_service_1.ListCommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map