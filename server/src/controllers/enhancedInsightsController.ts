// Insights controllers
// src/controllers/enhancedInsightsController.ts

import { Request, Response } from 'express';
import { EnhancedInsightsService } from '../services/enhancedInsightsService';
import { cache } from '../utils/cache'; // Implement caching for performance

export const getEnhancedInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `insights_${userId}`;
    
    // Check cache first
    const cachedInsights = await cache.get(cacheKey);
    if (cachedInsights) {
      return res.status(200).json(JSON.parse(cachedInsights));
    }

    // Generate new insights
    const insights = await EnhancedInsightsService.generateComprehensiveInsights(userId);
    
    // Cache the results (expire in 1 hour)
    await cache.set(cacheKey, JSON.stringify(insights), 3600);
    
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error getting enhanced insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate enhanced insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};