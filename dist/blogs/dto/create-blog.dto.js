var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMaxSize, IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, Matches, MaxLength, } from 'class-validator';
export class CreateBlogDto {
    title;
    slug;
    excerpt;
    thumbnailUrl;
    category;
    tags;
    content;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(220),
    Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must contain lowercase letters, numbers, and hyphens only',
    }),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "slug", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "excerpt", void 0);
__decorate([
    IsOptional(),
    IsUrl({ require_protocol: true }),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "thumbnailUrl", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "category", void 0);
__decorate([
    IsArray(),
    ArrayMaxSize(20),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "tags", void 0);
__decorate([
    IsObject(),
    __metadata("design:type", Object)
], CreateBlogDto.prototype, "content", void 0);
//# sourceMappingURL=create-blog.dto.js.map