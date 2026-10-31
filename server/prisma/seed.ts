import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const initialDomains = [
  {
    slug: 'fullstack',
    title: 'Full Stack Web Development',
    description: 'Modern full-stack engineering encompassing React, Node.js, databases, and microservices.',
    icon: 'Layers',
  },
  {
    slug: 'frontend',
    title: 'Frontend Engineering',
    description: 'Deep dive into React, TypeScript, web performance, component design, and state architecture.',
    icon: 'Layout',
  },
  {
    slug: 'backend',
    title: 'Backend Systems & Distributed Architecture',
    description: 'Scalable APIs, database optimization, caching, message queues, and high-concurrency systems.',
    icon: 'Server',
  },
  {
    slug: 'data-science',
    title: 'Data Science & Machine Learning',
    description: 'Data analytics, statistical modeling, machine learning pipelines, and Python ecosystem.',
    icon: 'Cpu',
  },
];

export async function seed() {
  console.log('🌱 Starting database seeding...');

  // Seed Domains
  for (const domain of initialDomains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: {
        title: domain.title,
        description: domain.description,
        icon: domain.icon,
      },
      create: domain,
    });
    console.log(`   - Seeded Domain: ${domain.title}`);
  }

  // Seed Admin Account
  const adminEmail = 'admin@hireready.ai';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@HireReady2026!', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        role: Role.ADMIN,
      },
    });
    console.log(`   - Seeded Admin: ${adminEmail}`);
  } else {
    console.log(`   - Admin ${adminEmail} already exists`);
  }

  console.log('✅ Seeding completed successfully.');
}

if (require.main === module) {
  seed()
    .catch((e) => {
      console.error('❌ Seeding error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
