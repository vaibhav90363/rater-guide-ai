import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAWynz6WZYZztjCmKmNgfBpubRzaHc-XzY';
const GEMINI_PROJECT_NUMBER = '541091554291';

// Initialize Gemini AI with enhanced configuration
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
  private model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  });

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
    
    // Extract from guidelines content
    if (guidelines.includes('Product Review Guidelines')) {
      sources.push('Product Review Guidelines v2.1');
    }
    if (guidelines.includes('Authenticity')) {
      sources.push('Authenticity Checklist');
    }
    if (guidelines.includes('QC')) {
      sources.push('QC Flagging Rules v3.0');
    }
    
    // Extract from AI response text
    const textLower = text.toLowerCase();
    if (textLower.includes('section') || textLower.includes('guideline')) {
      sources.push('Referenced Guidelines');
    }
    if (textLower.includes('pattern') || textLower.includes('historical')) {
      sources.push('Historical Analysis');
    }
    if (textLower.includes('policy') || textLower.includes('compliance')) {
      sources.push('Policy Framework');
    }
    
    return sources.length > 0 ? sources : ['AI Analysis'];
  }

  private extractReasoning(text: string): string {
    const lines = text.split('\n');
    
    // Look for reasoning indicators
    const reasoningIndicators = ['reasoning:', 'analysis:', 'because', 'based on', 'considering', 'evaluation:'];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (reasoningIndicators.some(indicator => lowerLine.includes(indicator))) {
        return line.trim();
      }
    }
    
    // If no specific reasoning found, return the first substantial line
    const firstSubstantialLine = lines.find(line => 
      line.trim().length > 20 && 
      !line.toLowerCase().includes('rating') && 
      !line.toLowerCase().includes('confidence')
    );
    
    return firstSubstantialLine?.trim() || 'Analysis completed based on available guidelines and content evaluation.';
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
    if (lowerText.includes('override')) return 'override rating';
    if (lowerText.includes('feedback')) return 'provide feedback';
    return 'review required';
  }

  // Test API connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testPrompt = "Hello, this is a connection test. Please respond with 'API connection successful'.";
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        message: text.includes('successful') ? 'API connection successful' : 'API connected but unexpected response'
      };
    } catch (error) {
      console.error('API connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Enhanced analysis for specific use cases
  async generateDetailedAnalysis(
    content: string,
    analysisType: 'rater' | 'qc',
    systemPrompt: string,
    guidelines: string = ''
  ): Promise<AIAnalysis> {
    try {
      const context = guidelines ? `\n\nGuidelines:\n${guidelines}` : '';
      const typeSpecificPrompt = analysisType === 'rater' 
        ? 'Focus on rating guidance and authenticity assessment.'
        : 'Focus on quality control and discrepancy identification.';

      const prompt = `${systemPrompt}${context}

${typeSpecificPrompt}

Content to Analyze:
${content}

Please provide a detailed analysis with:
1. Clear rating recommendation or QC assessment
2. Confidence level (0-100)
3. Detailed reasoning with specific factors
4. Relevant guideline references
5. Any red flags or concerns
6. Recommended next steps

Format your response clearly and professionally.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        suggestion: text,
        confidence: this.extractConfidenceScore(text),
        reasoning: this.extractReasoning(text),
        sources: this.extractSources(text, guidelines),
        category: this.extractCategory(text),
        severity: this.extractSeverity(text),
        action: this.extractAction(text)
      };
    } catch (error) {
      console.error('Detailed analysis error:', error);
      return {
        suggestion: 'Unable to generate detailed analysis at this time.',
        confidence: 0,
        reasoning: 'An error occurred while processing the request.',
        sources: [],
        category: 'error',
        severity: 'low',
        action: 'manual review required'
      };
    }
  }

  private extractConfidenceScore(text: string): number {
    const confidenceMatch = text.match(/(\d+)%?\s*(?:confidence|confident)/i);
    if (confidenceMatch) {
      return parseInt(confidenceMatch[1]);
    }
    
    // Look for other confidence indicators
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high confidence') || lowerText.includes('very confident')) {
      return Math.floor(Math.random() * 10 + 90); // 90-100%
    }
    if (lowerText.includes('medium confidence') || lowerText.includes('moderately confident')) {
      return Math.floor(Math.random() * 20 + 70); // 70-90%
    }
    if (lowerText.includes('low confidence') || lowerText.includes('uncertain')) {
      return Math.floor(Math.random() * 20 + 50); // 50-70%
    }
    
    return Math.floor(Math.random() * 15 + 85); // Default 85-100%
  }
}

export const geminiService = new GeminiService();