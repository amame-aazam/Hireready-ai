import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  public static async getStudentDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await DashboardService.getStudentDashboard(userId);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  }
}
