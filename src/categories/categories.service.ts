import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }
  async create(name: string) {
    try { return await this.prisma.category.create({ data: { name: name.trim() } }); }
    catch (e) { if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Category already exists'); throw e; }
  }
  async remove(id: string) { return this.prisma.category.delete({ where: { id } }); }
}
