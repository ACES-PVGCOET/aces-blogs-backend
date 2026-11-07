import * as argon2 from 'argon2';
import { PrismaClient, UserRole, UserStatus } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL or DIRECT_URL environment variable is missing.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ??
    process.env.ADMIN_EMAIL ??
    'admin@aces.org'
  )
    .trim()
    .toLowerCase();
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ??
    process.env.ADMIN_PASSWORD ??
    'Admin@123456!';
  const adminName =
    process.env.SEED_ADMIN_NAME ??
    process.env.ADMIN_NAME ??
    'Super Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await argon2.hash(adminPassword);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    console.log(`✅ Super Admin created: ${admin.email} (${admin.id})`);
  } else if (existingAdmin.role !== UserRole.ADMIN) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { role: UserRole.ADMIN, status: UserStatus.ACTIVE },
    });
    console.log(`✅ User promoted to ADMIN: ${existingAdmin.email}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`);
  }

  const defaultCategories = [
    'Technology',
    'Design',
    'Events',
    'Announcements',
    'Tutorials',
  ];

  for (const name of defaultCategories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`✅ Category ensured: ${category.name}`);
  }

  console.log('🌱 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
