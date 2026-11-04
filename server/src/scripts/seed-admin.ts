import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../config/postgres';

export async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'admin@hireready.ai').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'Admin@HireReady2026!';
  const firstName = process.env.ADMIN_FIRST_NAME || 'System';
  const lastName = process.env.ADMIN_LAST_NAME || 'Administrator';

  console.log(`🔐 Seeding Admin Account: ${email}...`);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        role: Role.ADMIN,
        passwordHash,
        firstName,
        lastName,
      },
      create: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: Role.ADMIN,
      },
    });

    console.log(`✅ Admin Account Active!`);
    console.log(`   User ID:   ${adminUser.id}`);
    console.log(`   Email:     ${adminUser.email}`);
    console.log(`   Role:      ${adminUser.role}`);
    console.log(`   Name:      ${adminUser.firstName} ${adminUser.lastName}`);
    return adminUser;
  } catch (error) {
    console.error('❌ Failed to seed admin account:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute when invoked directly
if (require.main === module || process.argv[1]?.includes('seed-admin')) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
