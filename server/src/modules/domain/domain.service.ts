import { prisma } from '../../config/postgres';
import { CreateDomainInput } from './domain.schemas';

export class DomainService {
  async listActiveDomains() {
    return prisma.domain.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        icon: true,
        _count: {
          select: { studentProfiles: true },
        },
      },
    });
  }

  async createDomain(input: CreateDomainInput) {
    const existing = await prisma.domain.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      const error: any = new Error(`Domain with slug "${input.slug}" already exists`);
      error.statusCode = 409;
      error.code = 'DOMAIN_ALREADY_EXISTS';
      throw error;
    }

    return prisma.domain.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        icon: input.icon,
      },
    });
  }
}

export const domainService = new DomainService();
