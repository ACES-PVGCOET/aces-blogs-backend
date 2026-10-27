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
import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { BlogsService } from '../blogs/blogs.service.js';
import { ReviewActionDto } from '../blogs/dto/review-decision.dto.js';
let ReviewerController = class ReviewerController {
    blogsService;
    constructor(blogsService) {
        this.blogsService = blogsService;
    }
    userId(req) {
        const id = req.user?.id ?? req.user?.sub;
        if (!id) {
            throw new UnauthorizedException('User ID missing from JWT');
        }
        return id;
    }
    getBlogsToReview(req) {
        return this.blogsService.getBlogsToReview(this.userId(req));
    }
    startReview(req, id, dto) {
        return this.blogsService.startReview(this.userId(req), id, dto);
    }
    comparison(req, id) {
        return this.blogsService.getComparison(this.userId(req), id);
    }
    publish(req, id, dto) {
        return this.blogsService.approveAndPublish(this.userId(req), id, dto);
    }
    rejectRevision(req, id, dto) {
        return this.blogsService.rejectRevision(this.userId(req), id, dto);
    }
};
__decorate([
    Get('blogs-to-review'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReviewerController.prototype, "getBlogsToReview", null);
__decorate([
    Post('blogs/:id/start-review'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReviewActionDto]),
    __metadata("design:returntype", void 0)
], ReviewerController.prototype, "startReview", null);
__decorate([
    Get('blogs/:id/comparison'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReviewerController.prototype, "comparison", null);
__decorate([
    Post('blogs/:id/publish'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReviewActionDto]),
    __metadata("design:returntype", void 0)
], ReviewerController.prototype, "publish", null);
__decorate([
    Post('blogs/:id/reject-revision'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReviewActionDto]),
    __metadata("design:returntype", void 0)
], ReviewerController.prototype, "rejectRevision", null);
ReviewerController = __decorate([
    Controller('reviewer'),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(UserRole.REVIEWER, UserRole.ADMIN),
    __metadata("design:paramtypes", [BlogsService])
], ReviewerController);
export { ReviewerController };
//# sourceMappingURL=reviewer.controller.js.map