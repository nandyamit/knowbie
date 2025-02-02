import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Badge } from '../models/badge';

const router = Router();

// Get badges for authenticated user
router.get('/my-badges', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const badges = await Badge.findAll({ where: { userId } });

    const imageUrls = badges.map(badge => badge.getImageUrl()); // 

    res.json({ badgeImages: imageUrls }); // 
  } catch (error) {
    console.error('Error retrieving badge images:', error);
    res.status(500).json({ error: 'Failed to retrieve badge images' });
  }
});

export const badgeRoutes = router;