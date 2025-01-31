// OpenAI service

// server/src/services/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openAiService = {
  async generateExplanation(question: string, answer: string) {
    try {
      const prompt = `For the trivia question: "${question}", the correct answer is "${answer}". 
                     Please provide a brief but informative explanation (2-3 sentences) about why this is the correct answer. 
                     Include interesting facts or context that would help someone learn and remember this information.`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a knowledgeable tutor providing concise, educational explanations for trivia answers." },
          { role: "user", content: prompt }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || 'No explanation available';
    } catch (error) {
      console.error('OpenAI service error:', error);
      throw error;
    }
  }
};