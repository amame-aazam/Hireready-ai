import { prisma } from '../../config/postgres';

export interface LeaderboardEntry {
  rank: number;
  candidateId: string;
  displayName: string;
  targetDomain: string;
  compositeScore: number;
  percentile: number;
  status: string;
  breakdown: {
    resume: number | null;
    oa: number | null;
    dsa: number | null;
    hr: number | null;
  };
  finalOutcomeAt: Date | null;
}

export interface LeaderboardResponse {
  totalCandidates: number;
  page: number;
  limit: number;
  rankings: LeaderboardEntry[];
}

export class LeaderboardService {
  /**
   * Masks a candidate's full name into a privacy-safe display name (e.g. "Alex C.")
   * Ensures zero PII (email, full legal surname) is exposed.
   */
  public static maskDisplayName(firstName?: string | null, lastName?: string | null): string {
    const first = (firstName || 'Candidate').trim();
    const lastInitial = (lastName || '').trim().charAt(0);
    return lastInitial ? `${first} ${lastInitial.toUpperCase()}.` : first;
  }

  /**
   * Generates a masked short candidate identifier (e.g. "cnd_4a8f")
   */
  public static maskCandidateId(id: string): string {
    const hash = id.replace(/-/g, '').substring(0, 6);
    return `cnd_${hash}`;
  }

  /**
   * Fetches public leaderboard rankings of completed candidates
   * Incomplete candidates are strictly excluded.
   */
  public static async getLeaderboard(
    domain?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<LeaderboardResponse> {
    const validLimit = Math.min(50, Math.max(1, limit));
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * validLimit;

    // Filter condition: ONLY completed applications with an authoritative compositeScore
    const whereClause: any = {
      compositeScore: { not: null },
    };

    if (domain && domain.trim().toLowerCase() !== 'all') {
      whereClause.targetDomain = {
        contains: domain.trim(),
        mode: 'insensitive',
      };
    }

    // Total count for pagination and percentile calculation
    const totalCandidates = await prisma.application.count({
      where: whereClause,
    });

    // Fetch ranked applications descending by compositeScore
    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            // Explicitly DO NOT select email to safeguard PII
          },
        },
      },
      orderBy: [{ compositeScore: 'desc' }, { finalOutcomeAt: 'asc' }],
      skip,
      take: validLimit,
    });

    const rankings: LeaderboardEntry[] = applications.map((app: any, index: number) => {
      const overallRank = skip + index + 1;
      const percentile =
        totalCandidates > 0
          ? Number((((totalCandidates - overallRank + 1) / totalCandidates) * 100).toFixed(1))
          : 100.0;

      return {
        rank: overallRank,
        candidateId: this.maskCandidateId(app.id),
        displayName: this.maskDisplayName(app.user?.firstName, app.user?.lastName),
        targetDomain: app.targetDomain,
        compositeScore: app.compositeScore!,
        percentile,
        status: app.status,
        breakdown: {
          resume: app.resumeScore,
          oa: app.oaScore,
          dsa: app.dsaScore,
          hr: app.hrScore,
        },
        finalOutcomeAt: app.finalOutcomeAt,
      };
    });

    return {
      totalCandidates,
      page: validPage,
      limit: validLimit,
      rankings,
    };
  }
}
