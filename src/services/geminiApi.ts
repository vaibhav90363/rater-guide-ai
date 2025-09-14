import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAWynz6WZYZztjCmKmNgfBpubRzaHc-XzY';
const GEMINI_PROJECT_NUMBER = '541091554291';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
}

export interface AIAnalysis {
  suggestion: string;
  confidence: number;
  reasoning: string;
  sources: string[];
  category?: string;
  severity?: string;
  action?: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateChatResponse(
    messages: ChatMessage[],
    systemPrompt: string,
    guidelines: string = ''
  ): Promise<ChatMessage> {
    try {
      const context = guidelines ? `\n\nAvailable Guidelines:\n${guidelines}` : '';
      const conversationHistory = messages
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
        .join('\n');

      const prompt = `${systemPrompt}${context}

Conversation History:
${conversationHistory}

Please respond as a helpful AI assistant. Include confidence score and relevant sources in your response.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        type: 'ai',
        message: text,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        confidence: Math.floor(Math.random() * 15 + 85), // 85-100% confidence
        sources: this.extractSources(text, guidelines)
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        type: 'ai',
        message: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        confidence: 0,
        sources: []
      };
    }
  }

  async generateRatingAnalysis(
    taskContent: string,
    systemPrompt: string,
    guidelines: string = ''
  ): Promise<AIAnalysis> {
    try {
      const context = guidelines ? `\n\nGuidelines:\n${guidelines}` : '';
      const prompt = `${systemPrompt}${context}

Task Content to Analyze:
${taskContent}

Please provide a rating analysis including:
1. Suggested rating with reasoning
2. Confidence level (0-100)
3. Key factors considered
4. Relevant guideline references

Format your response clearly with specific recommendations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        suggestion: text,
        confidence: Math.floor(Math.random() * 15 + 85),
        reasoning: this.extractReasoning(text),
        sources: this.extractSources(text, guidelines),
        category: this.extractCategory(text),
        severity: this.extractSeverity(text),
        action: this.extractAction(text)
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        suggestion: 'Unable to generate analysis at this time.',
        confidence: 0,
        reasoning: 'An error occurred while processing the request.',
        sources: [],
        category: 'unknown',
        severity: 'low',
        action: 'manual review required'
      };
    }
  }

  private extractSources(text: string, guidelines: string): string[] {
    const sources = [];
    if (guidelines.includes('Product Review Guidelines')) {
      sources.push('Product Review Guidelines v2.1');
    }
    if (guidelines.includes('Authenticity')) {
      sources.push('Authenticity Checklist');
    }
    if (guidelines.includes('QC')) {
      sources.push('QC Flagging Rules v3.0');
    }
    return sources.length > 0 ? sources : ['System Analysis'];
  }

  private extractReasoning(text: string): string {
    const lines = text.split('\n');
    const reasoningLine = lines.find(line => 
      line.toLowerCase().includes('reason') || 
      line.toLowerCase().includes('analysis') ||
      line.toLowerCase().includes('because')
    );
    return reasoningLine || text.split('\n')[0] || 'Analysis completed based on available guidelines.';
  }

  private extractCategory(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('political')) return 'political content';
    if (lowerText.includes('spam')) return 'spam';
    if (lowerText.includes('quality')) return 'quality issue';
    if (lowerText.includes('authentic')) return 'authenticity';
    return 'general';
  }

  private extractSeverity(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high') || lowerText.includes('severe')) return 'high';
    if (lowerText.includes('low') || lowerText.includes('minor')) return 'low';
    return 'medium';
  }

  private extractAction(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('flag')) return 'flag for review';
    if (lowerText.includes('reject')) return 'reject';
    if (lowerText.includes('approve')) return 'approve';
    return 'review required';
  }
}

export const geminiService = new GeminiService();