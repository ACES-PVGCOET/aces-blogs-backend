import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminSeedService } from './admin-seed.service.js';
import { UserRole, UserStatus } from '../../generated/prisma/client.js';

describe('AdminSeedService', () => {
  let service: AdminSeedService;
  let mockPrisma: any;
  let mockConfig: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'SEED_ADMIN_EMAIL') return 'admin@test.com';
        if (key === 'SEED_ADMIN_PASSWORD') return 'SecretPass123!';
        if (key === 'SEED_ADMIN_NAME') return 'Test Super Admin';
        return undefined;
      }),
    };

    service = new AdminSeedService(mockPrisma as any, mockConfig as any);
  });

  it('should create a Super Admin if none exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'uuid-1',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    await service.onApplicationBootstrap();

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@test.com' },
    });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'admin@test.com',
        name: 'Test Super Admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      }),
    });
  });

  it('should promote an existing non-admin user to ADMIN', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'uuid-2',
      email: 'admin@test.com',
      role: UserRole.READER,
      status: UserStatus.ACTIVE,
    });
    mockPrisma.user.update.mockResolvedValue({
      id: 'uuid-2',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    await service.onApplicationBootstrap();

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'uuid-2' },
      data: {
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('should not create or update if admin already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'uuid-3',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    await service.onApplicationBootstrap();

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});
