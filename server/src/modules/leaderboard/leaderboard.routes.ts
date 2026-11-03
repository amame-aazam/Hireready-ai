import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';

const router = Router();

// Public / Authenticated Leaderboard (Privacy-Preserving)
router.get('/', LeaderboardController.getLeaderboard);

export default router;
