import { useState } from "react";
import RaterPlatform from "./RaterPlatform";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Maximize2
} from "lucide-react";

const RaterPlugin = () => {
  const [showPlugin, setShowPlugin] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  
  const chatHistory = [
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
  ];

  const aiSuggestion = {
    rating: "Good",
    confidence: 87,
    reasoning: "Content shows specific product details and balanced perspective. Language appears authentic with concrete examples.",
    guidelines: ["Relevance Check", "Authenticity Assessment", "Detail Analysis"]
  };

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
              <span className="font-medium text-sm">Rater Assistant</span>
              <Badge className="bg-success/10 text-success text-xs">Active</Badge>
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
                  Chat
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
                  Rate
                </button>
              </div>

              <CardContent className="p-0 h-[450px] flex flex-col">
                {activeMode === "chat" ? (
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
                                    <span>{msg.sources?.length} sources</span>
                                  </div>
                                </div>
                              )}
                              <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask about guidelines, get rating help..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Rate Mode */
                  <div className="p-4 space-y-4">
                    {/* AI Suggestion */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">AI Suggestion</span>
                        <Badge className="bg-primary/10 text-primary text-xs">
                          {aiSuggestion.confidence}% confidence
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Recommended Rating:</span>
                          <Badge className="bg-success/10 text-success">{aiSuggestion.rating}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {aiSuggestion.reasoning}
                        </p>
                        
                        <div className="flex items-center gap-1 flex-wrap">
                          {aiSuggestion.guidelines.map((guideline, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {guideline}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept AI Suggestion
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        View Full Guidelines
                      </Button>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Quick Checklist:</span>
                      <div className="space-y-1">
                        {[
                          "Content relevance verified",
                          "Language authenticity checked", 
                          "Specific details present",
                          "Balanced perspective maintained"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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