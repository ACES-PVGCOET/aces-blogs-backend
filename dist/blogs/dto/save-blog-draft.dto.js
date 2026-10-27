var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsInt, IsObject, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
export class SaveBlogContentDto {
    expectedVersion;
    content;
    changeSummary;
}
__decorate([
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], SaveBlogContentDto.prototype, "expectedVersion", void 0);
__decorate([
    IsObject(),
    __metadata("design:type", Object)
], SaveBlogContentDto.prototype, "content", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], SaveBlogContentDto.prototype, "changeSummary", void 0);
//# sourceMappingURL=save-blog-draft.dto.js.map