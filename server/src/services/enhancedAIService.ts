// src/services/enhancedInsightsService.ts

import { TestAttempt } from '../models/testAttempt';
import { OpenAI } from '../config/openai';
import axios from 'axios';

interface LearningPattern {
  timeOfDay: string;
  dayOfWeek: string;
  sessionDuration: number;
  averageScore: number;
}

interface TopicStrength {
  topic: string;
  correctRate: number;
  totalQuestions: number;
}

interface MLPrediction {
  predictedScore: number;
  confidence: number;
  recommendedTopics: string[];
}

export class EnhancedInsightsService {
  static async generateComprehensiveInsights(userId: string) {
    try {
      // Fetch user's test attempts
      const attempts = await TestAttempt.findAll({
        where: { userId },
        order: [['dateTaken', 'DESC']]
      });

      if (attempts.length === 0) {
        return this.getDefaultInsights();
      }

      // Parallel processing of different types of insights
      const [
        aiAnalysis,
        mlPredictions,
        learningPatterns,
        externalResources
      ] = await Promise.all([
        this.getGPTAnalysis(attempts),
        this.getMLPredictions(attempts),
        this.analyzeLearningPatterns(attempts),
        this.fetchExternalResources(attempts)
      ]);

      // Combine all insights
      return this.combineInsights({
        aiAnalysis,
        mlPredictions,
        learningPatterns,
        externalResources
      });
    } catch (error) {
      console.error('Error generating comprehensive insights:', error);
      throw new Error('Failed to generate insights');
    }
  }

  private static async getGPTAnalysis(attempts: TestAttempt[]) {
    const performanceData = this.preparePerformanceData(attempts);
    const prompt = this.createDetailedPrompt(performanceData);

    const response = await OpenAI.createCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an advanced educational analytics expert. Analyze the student's 
                   performance data and provide detailed insights. Focus on identifying specific 
                   patterns, learning style indicators, and actionable recommendations. Include 
                   psychological factors like optimal learning times and motivation patterns.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private static async getMLPredictions(attempts: TestAttempt[]): Promise<MLPrediction> {
    // Prepare features for ML model
    const features = this.extractMLFeatures(attempts);

    // Here you would typically call your ML model API
    // For now, we'll use a simple heuristic-based prediction
    const recentScores = attempts.slice(0, 5).map(a => a.score);
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const trend = recentScores[0] - recentScores[recentScores.length - 1];

    return {
      predictedScore: Math.min(10, avgScore + (trend / 2)),
      confidence: 0.7,
      recommendedTopics: this.getRecommendedTopics(attempts)
    };
  }

  private static async analyzeLearningPatterns(attempts: TestAttempt[]): Promise<LearningPattern[]> {
    // Analyze when the user performs best
    const patterns = attempts.map(attempt => {
      const date = new Date(attempt.dateTaken);
      return {
        timeOfDay: this.getTimeOfDay(date),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
        sessionDuration: 15, // Assuming 15 minutes per test
        score: attempt.score
      };
    });

    // Group and analyze patterns
    return this.aggregateLearningPatterns(patterns);
  }

  private static async fetchExternalResources(attempts: TestAttempt[]) {
    const resources: Record<string, any[]> = {
      Film: [],
      Music: [],
      Books: []
    };

    // Parallel fetch from multiple APIs
    await Promise.all([
      this.fetchCourseraResources(resources),
      this.fetchYouTubeResources(resources),
      this.fetchGoodreadsResources(resources)
    ]);

    return resources;
  }

  private static async fetchCourseraResources(resources: Record<string, any[]>) {
    try {
      // Implement Coursera API integration
      const COURSERA_API = 'https://api.coursera.org/api/courses.v1';
      // Add actual API implementation
    } catch (error) {
      console.error('Error fetching Coursera resources:', error);
    }
  }

  private static async fetchYouTubeResources(resources: Record<string, any[]>) {
    try {
      // Implement YouTube API integration
      const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';
      // Add actual API implementation
    } catch (error) {
      console.error('Error fetching YouTube resources:', error);
    }
  }

  private static async fetchGoodreadsResources(resources: Record<string, any[]>) {
    try {
      // Implement Goodreads API integration
      // Add actual API implementation
    } catch (error) {
      console.error('Error fetching Goodreads resources:', error);
    }
  }

  private static getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private static aggregateLearningPatterns(patterns: any[]): LearningPattern[] {
    // Group and analyze patterns by time of day and day of week
    const aggregated = patterns.reduce((acc, pattern) => {
      const key = `${pattern.timeOfDay}-${pattern.dayOfWeek}`;
      if (!acc[key]) {
        acc[key] = {
          scores: [],
          count: 0
        };
      }
      acc[key].scores.push(pattern.score);
      acc[key].count++;
      return acc;
    }, {});

    // Convert to learning patterns
    return Object.entries(aggregated).map(([key, data]: [string, any]) => {
      const [timeOfDay, dayOfWeek] = key.split('-');
      return {
        timeOfDay,
        dayOfWeek,
        sessionDuration: 15,
        averageScore: data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length
      };
    }).sort((a, b) => b.averageScore - a.averageScore);
  }

  private static getRecommendedTopics(attempts: TestAttempt[]): string[] {
    // Analyze weak areas and return recommended topics
    // This would typically use more sophisticated analysis
    return ['Contemporary Cinema', 'Classical Music Theory', 'Modern Literature'];
  }

  private static preparePerformanceData(attempts: TestAttempt[]) {
    // Enhanced data preparation for GPT analysis
    return {
      performance: this.analyzePerformanceMetrics(attempts),
      patterns: this.analyzeLearningPatterns(attempts),
      categoryBreakdown: this.analyzeCategoryPerformance(attempts)
    };
  }

  private static analyzePerformanceMetrics(attempts: TestAttempt[]) {
    // Calculate comprehensive performance metrics
    return {
      overall: {
        totalAttempts: attempts.length,
        averageScore: attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length,
        improvement: this.calculateImprovement(attempts)
      },
      byCategory: this.groupByCategory(attempts)
    };
  }

  private static calculateImprovement(attempts: TestAttempt[]) {
    if (attempts.length < 2) return 0;
    const recent = attempts.slice(0, Math.min(5, attempts.length));
    const firstScore = recent[recent.length - 1].score;
    const lastScore = recent[0].score;
    return ((lastScore - firstScore) / firstScore) * 100;
  }

  private static groupByCategory(attempts: TestAttempt[]) {
    return attempts.reduce((acc, attempt) => {
      if (!acc[attempt.category]) {
        acc[attempt.category] = [];
      }
      acc[attempt.category].push(attempt);
      return acc;
    }, {} as Record<string, TestAttempt[]>);
  }

  private static getDefaultInsights() {
    return {
      summary: "Start your learning journey by taking some tests!",
      recommendations: [
        "Try taking tests in different categories to discover your interests",
        "Start with basics in each category to build a strong foundation",
        "Use the explanations feature to learn from each question"
      ]
    };
  }

  private static extractMLFeatures(attempts: TestAttempt[]) {
    // Extract relevant features for ML prediction
    return attempts.map(attempt => ({
      score: attempt.score,
      category: attempt.category,
      dayOfWeek: new Date(attempt.dateTaken).getDay(),
      hourOfDay: new Date(attempt.dateTaken).getHours(),
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers
    }));
  }
}