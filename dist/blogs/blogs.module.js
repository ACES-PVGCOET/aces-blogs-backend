var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { BlogsController } from './blogs.controller.js';
import { PublicBlogsController } from './public-blogs.controller.js';
import { BlogsService } from './blogs.service.js';
import { BlogAuditService } from './blog-audit.service.js';
let BlogsModule = class BlogsModule {
};
BlogsModule = __decorate([
    Module({
        imports: [PrismaModule],
        controllers: [
            BlogsController,
            PublicBlogsController,
        ],
        providers: [
            BlogsService,
            BlogAuditService,
            RolesGuard,
        ],
        exports: [
            BlogsService,
        ],
    })
], BlogsModule);
export { BlogsModule };
//# sourceMappingURL=blogs.module.js.map