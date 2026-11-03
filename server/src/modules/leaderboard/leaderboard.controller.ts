import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from './leaderboard.service';

export class LeaderboardController {
  public static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = req.query.domain as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const data = await LeaderboardService.getLeaderboard(domain, page, limit);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  }
}
