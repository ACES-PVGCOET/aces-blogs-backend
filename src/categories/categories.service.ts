import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * CONTRACT used by blog-post-api: when a blog is published (review passed), it calls
 * findOrCreate(name) so the category exists. Must be safe to call twice at the same time.
 * The blog-cat-api branch replaces this body; keep the signature (or agree a change in a PR).
 */
@Injectable()
export class CategoriesService {
  findOrCreate(_name: string): Promise<{ id: string; name: string }> {
    throw new NotImplementedException('CategoriesService.findOrCreate is implemented on feat/blog-cat-api');
  }
}
