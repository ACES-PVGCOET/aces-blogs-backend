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
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { BlogsService } from './blogs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto.js';
let BlogsController = class BlogsController {
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
    create(req, dto) {
        return this.blogsService.createBlog(this.userId(req), dto);
    }
    getEditable(req, id) {
        return this.blogsService.getEditableBlog(this.userId(req), id);
    }
    saveContent(req, id, dto) {
        return this.blogsService.saveContent(this.userId(req), id, dto);
    }
    archive(req, id) {
        return this.blogsService.archiveBlog(this.userId(req), id);
    }
    delete(req, id) {
        return this.blogsService.deleteBlog(this.userId(req), id);
    }
};
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "create", null);
__decorate([
    Get(':id/editable'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getEditable", null);
__decorate([
    Patch(':id/content'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SaveBlogContentDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "saveContent", null);
__decorate([
    Post(':id/archive'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "archive", null);
__decorate([
    Delete(':id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "delete", null);
BlogsController = __decorate([
    Controller('blogs'),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(UserRole.WRITER, UserRole.ADMIN),
    __metadata("design:paramtypes", [BlogsService])
], BlogsController);
export { BlogsController };
//# sourceMappingURL=blogs.controller.js.map