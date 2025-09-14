import { useState, useEffect } from "react";
import RaterPlatform from "./RaterPlatform";
import GuidelineUpload from "@/components/GuidelineUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geminiService, ChatMessage, AIAnalysis } from "@/services/geminiApi";
import { RATER_SYSTEM_PROMPT } from "@/data/systemPrompts";
import { 
  Bot, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  Lightbulb, 
  BookOpen,
  X,
  Send,
  Minimize2,
  Maximize2,
  Shield,
  AlertTriangle,
  Flag,
  ExternalLink
} from "lucide-react";

const RaterPlugin = () => {
  const [showPlugin, setShowPlugin] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState("rate");
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guidelines, setGuidelines] = useState("");
  const [checklistItems, setChecklistItems] = useState({
    contentReviewed: false,
    guidelinesConsulted: false,
    contextAnalyzed: false,
    confidenceEvaluated: false
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "user",
      message: "What should I focus on when rating this product review?",
      timestamp: "14:30"
    },
    {
      type: "ai",
      message: "For product reviews, focus on these key areas:\n\n1. **Relevance** - Does the review address the actual product?\n2. **Specificity** - Are there concrete details about features/performance?\n3. **Balance** - Does it mention both pros and cons appropriately?\n4. **Authenticity** - Does the language seem natural and genuine?\n\nFor this review, I notice it's positive and mentions specific aspects like 'build quality' and 'packaging' - good signs of authenticity.",
      timestamp: "14:31",
      confidence: 92,
      sources: ["Product Review Guidelines v2.1", "Authenticity Checklist"]
    }
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    suggestion: "Analyzing current task content...",
    confidence: 87,
    reasoning: "Content contains political messaging with potential for controversy. Safety guidelines section 3.2.1 indicates this should be flagged for human review.",
    sources: [
      "Political content policy (Section 3.2.1)",
      "Similar case: TSK_4321 - flagged correctly",
      "Keyword analysis: 95% political indicators"
    ],
    category: "political content",
    severity: "medium",
    action: "flag for review"
  });

  const handleChecklistChange = (item: keyof typeof checklistItems) => {
    setChecklistItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      type: "user",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await geminiService.generateChatResponse(
        [...chatHistory, userMessage],
        RATER_SYSTEM_PROMPT,
        guidelines
      );
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const taskContent = "Sample product review: This laptop has amazing build quality and the packaging was great. Really happy with my purchase!";
      const analysis = await geminiService.generateRatingAnalysis(
        taskContent,
        RATER_SYSTEM_PROMPT,
        guidelines
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate AI analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (guidelines && activeMode === "rate") {
      generateAIAnalysis();
    }
  }, [guidelines, activeMode]);

  if (!showPlugin) {
    return <RaterPlatform onPluginToggle={() => setShowPlugin(true)} showPlugin={false} />;
  }

  return (
    <div className="relative">
      <RaterPlatform onPluginToggle={() => setShowPlugin(false)} showPlugin={true} />
      
      {/* Plugin Overlay */}
      <div className={`fixed transition-all duration-300 z-50 ${
        isMinimized 
          ? "bottom-4 right-4 w-80 h-12" 
          : "bottom-4 right-4 w-96 h-[600px]"
      }`}>
        <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
          {/* Plugin Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm">AI Rater Assistant</span>
              <Badge className="bg-primary/10 text-primary text-xs">Premium</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPlugin(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveMode("chat")}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeMode === "chat"
                      ? "border-b-2 border-primary bg-accent/50"
                      : "hover:bg-accent/30"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Chat Mode
                </button>
                <button
                  onClick={() => setActiveMode("rate")}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeMode === "rate"
                      ? "border-b-2 border-primary bg-accent/50"
                      : "hover:bg-accent/30"
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Rate Mode
                </button>
                <button
                  onClick={() => setActiveMode("setup")}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeMode === "setup"
                      ? "border-b-2 border-primary bg-accent/50"
                      : "hover:bg-accent/30"
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Setup
                </button>
              </div>

              <CardContent className="p-0 h-[450px] flex flex-col">
                {activeMode === "setup" ? (
                  <div className="p-4 h-full">
                    <GuidelineUpload 
                      type="rater" 
                      onGuidelinesChange={setGuidelines}
                    />
                  </div>
                ) : activeMode === "chat" ? (
                  <>
                    {/* Chat History */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] ${
                              msg.type === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-accent"
                            } rounded-lg p-3`}>
                              <div className="text-sm whitespace-pre-line">{msg.message}</div>
                              {msg.type === "ai" && (
                                <div className="mt-2 pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Confidence: {msg.confidence}%</span>
                                    <span>•</span>
                                    <span>{msg.sources?.length || 0} sources</span>
                                  </div>
                                </div>
                              )}
                              <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-accent rounded-lg p-3 max-w-[80%]">
                              <div className="text-sm">AI is thinking...</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                     {/* Chat Input */}
                     <div className="p-4 border-t">
                       <div className="flex gap-2">
                         <Input
                           placeholder="Ask about guidelines, get rating help..."
                           value={chatMessage}
                           onChange={(e) => setChatMessage(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                           className="flex-1"
                           disabled={isLoading}
                         />
                         <Button size="sm" onClick={handleSendMessage} disabled={isLoading || !chatMessage.trim()}>
                           <Send className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                  </>
                ) : (
                  /* Rate Mode */
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                    {/* Rating Checklist */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">Rating Checklist</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="content-reviewed"
                            checked={checklistItems.contentReviewed}
                            onCheckedChange={() => handleChecklistChange('contentReviewed')}
                          />
                          <label 
                            htmlFor="content-reviewed" 
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Content thoroughly reviewed
                          </label>
                          <a 
                            href="#" 
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            Section 2.1 - Content Review Process
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="guidelines-consulted"
                            checked={checklistItems.guidelinesConsulted}
                            onCheckedChange={() => handleChecklistChange('guidelinesConsulted')}
                          />
                          <label 
                            htmlFor="guidelines-consulted" 
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Relevant guidelines consulted
                          </label>
                          <a 
                            href="#" 
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            Always reference applicable sections
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="context-analyzed"
                            checked={checklistItems.contextAnalyzed}
                            onCheckedChange={() => handleChecklistChange('contextAnalyzed')}
                          />
                          <label 
                            htmlFor="context-analyzed" 
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Context and intent analyzed
                          </label>
                          <a 
                            href="#" 
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            Section 4.3 - Context Analysis
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="confidence-evaluated"
                            checked={checklistItems.confidenceEvaluated}
                            onCheckedChange={() => handleChecklistChange('confidenceEvaluated')}
                          />
                          <label 
                            htmlFor="confidence-evaluated" 
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Confidence level evaluated
                          </label>
                          <a 
                            href="#" 
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            Rate certainty on 1-10 scale
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">AI Suggestion</h3>
                        <Badge className="bg-primary/10 text-primary text-xs">
                          {aiAnalysis.confidence}% confident
                        </Badge>
                      </div>
                      
                      <div className="bg-card border rounded-lg p-4 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                               <BookOpen className="w-4 h-4 text-muted-foreground" />
                               <span className="text-sm font-medium">Category:</span>
                             </div>
                             <Badge variant="outline" className="text-xs">
                               {aiAnalysis.category}
                             </Badge>
                           </div>
                           
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                               <AlertTriangle className="w-4 h-4 text-warning" />
                               <span className="text-sm font-medium">Severity:</span>
                             </div>
                             <Badge variant="secondary" className="text-xs">
                               {aiAnalysis.severity}
                             </Badge>
                           </div>
                           
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                               <Flag className="w-4 h-4 text-primary" />
                               <span className="text-sm font-medium">Action:</span>
                             </div>
                             <Badge className="bg-primary/10 text-primary text-xs">
                               {aiAnalysis.action}
                             </Badge>
                           </div>
                         </div>
                         
                         <div>
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-sm font-medium">AI Confidence</span>
                             <span className="text-sm text-muted-foreground">{aiAnalysis.confidence}%</span>
                           </div>
                           <Progress value={aiAnalysis.confidence} className="h-2" />
                         </div>
                         
                         <div>
                           <span className="text-sm font-medium block mb-2">Reasoning:</span>
                           <p className="text-sm text-muted-foreground leading-relaxed">
                             {aiAnalysis.reasoning}
                           </p>
                         </div>
                         
                         <div>
                           <span className="text-sm font-medium block mb-2">Supporting Evidence:</span>
                           <ul className="space-y-1">
                             {aiAnalysis.sources.map((evidence, index) => (
                               <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                 <span className="text-primary mt-1">•</span>
                                 {evidence}
                               </li>
                             ))}
                           </ul>
                         </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Suggestion
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Modify Rating
                          </Button>
                        </div>
                        
                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Suggestion:</span> Review context for additional nuance before final decision.
                          </p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RaterPlugin;