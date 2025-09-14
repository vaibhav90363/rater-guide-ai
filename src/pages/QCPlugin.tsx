import { useState, useEffect } from "react";
import QCPlatform from "./QCPlatform";
import GuidelineUpload from "@/components/GuidelineUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  X,
  Send,
  Minimize2,
  Maximize2,
  User,
  Flag
} from "lucide-react";
import { geminiService, ChatMessage, AIAnalysis } from "@/services/geminiApi";
import { QC_SYSTEM_PROMPT } from "@/data/systemPrompts";

const QCPlugin = () => {
  const [showPlugin, setShowPlugin] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState("analysis");
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guidelines, setGuidelines] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "user",
      message: "Why is this task flagged as high priority?",
      timestamp: "15:23"
    },
    {
      type: "ai", 
      message: "This task was flagged due to a significant discrepancy between the rater's assessment and our AI model:\n\n**Key Issues:**\n• Rater scored 'Excellent' vs AI suggested 'Poor'\n• Content indicates negative sentiment but rater rated positively\n• Rater's recent accuracy has declined to 87.3%\n\n**Recommendation:** Review against authenticity guidelines and provide targeted feedback.",
      timestamp: "15:24",
      confidence: 94,
      sources: ["QC Flagging Rules v3.0", "Rater Performance Data"]
    }
  ]);

  const [analysisData, setAnalysisData] = useState<AIAnalysis>({
    suggestion: "High-priority review flagged by AI analysis",
    confidence: 94,
    reasoning: "Significant discrepancy detected between rater assessment and content analysis. Rater's recent performance decline indicates need for intervention.",
    sources: [
      "QC Flagging Rules v3.0",
      "Rater Performance Data", 
      "Content Analysis Algorithm"
    ],
    category: "performance",
    severity: "high",
    action: "provide feedback"
  });

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
        QC_SYSTEM_PROMPT,
        guidelines
      );
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQCAnalysis = async () => {
    setIsLoading(true);
    try {
      const taskContent = "Rater gave 'Excellent' rating to review that contains negative sentiment and generic language. Rater accuracy: 87.3%";
      const analysis = await geminiService.generateRatingAnalysis(
        taskContent,
        QC_SYSTEM_PROMPT,
        guidelines
      );
      setAnalysisData(analysis);
    } catch (error) {
      console.error('Failed to generate QC analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (guidelines && activeMode === "analysis") {
      generateQCAnalysis();
    }
  }, [guidelines, activeMode]);

  if (!showPlugin) {
    return <QCPlatform onPluginToggle={() => setShowPlugin(true)} showPlugin={false} />;
  }

  return (
    <div className="relative">
      <QCPlatform onPluginToggle={() => setShowPlugin(false)} showPlugin={true} />
      
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
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm">QC Assistant</span>
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
                  onClick={() => setActiveMode("analysis")}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeMode === "analysis"
                      ? "border-b-2 border-primary bg-accent/50"
                      : "hover:bg-accent/30"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 inline mr-2" />
                  Analysis
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
                      type="qc" 
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
                              <div className="text-sm">AI is analyzing...</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask about QC rules, flagging criteria..."
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
                  /* Analysis Mode */
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {/* Task Analysis Card */}
                      <div className="bg-card border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Task Analysis</h3>
                          <Badge className="bg-destructive/10 text-destructive text-xs">
                            {analysisData.confidence}% Risk Score
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Category:</span>
                              <div className="font-medium text-destructive">{analysisData.category}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Confidence:</span>
                              <div className="font-medium">{analysisData.confidence}%</div>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground mb-2 block">Evidence:</span>
                            <div className="space-y-1">
                              {analysisData.sources.map((item, index) => (
                                <div key={index} className="flex items-start gap-2 text-xs">
                                  <Flag className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-muted-foreground mb-2 block">Reasoning:</span>
                            <p className="text-xs text-muted-foreground">{analysisData.reasoning}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2 pt-2">
                        <Button className="w-full bg-destructive hover:bg-destructive/90" size="sm">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Override Rating
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">
                            Send Feedback
                          </Button>
                          <Button variant="outline" size="sm">
                            View Guidelines
                          </Button>
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

export default QCPlugin;