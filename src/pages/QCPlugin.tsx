import { useState } from "react";
import QCPlatform from "./QCPlatform";
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

const QCPlugin = () => {
  const [showPlugin, setShowPlugin] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState("analysis");
  const [chatMessage, setChatMessage] = useState("");
  
  const chatHistory = [
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
  ];

  const analysisData = {
    riskScore: 91,
    discrepancy: "High",
    confidence: 94,
    evidence: [
      "Rating contradiction with content sentiment",
      "Rater accuracy below threshold (87.3%)",
      "Pattern of over-positive ratings detected"
    ],
    recommendation: "Override rating and send detailed feedback",
    guideline: "Authenticity Assessment Guidelines v2.1"
  };

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
          : "bottom-4 right-4 w-[420px] h-[650px]"
      }`}>
        <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
          {/* Plugin Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm">QC Assistant</span>
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
                  onClick={() => setActiveMode("analysis")}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeMode === "analysis"
                      ? "border-b-2 border-primary bg-accent/50"
                      : "hover:bg-accent/30"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Analysis
                </button>
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
              </div>

              <CardContent className="p-0 h-[500px] flex flex-col">
                {activeMode === "analysis" ? (
                  <div className="p-4 space-y-4 flex-1">
                    {/* Risk Assessment */}
                    <div className="bg-gradient-to-r from-destructive/5 to-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="font-medium text-sm">Risk Assessment</span>
                        <Badge className="bg-destructive/10 text-destructive text-xs">
                          {analysisData.riskScore}% Risk Score
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Discrepancy:</span>
                            <div className="font-medium text-destructive">{analysisData.discrepancy}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <div className="font-medium">{analysisData.confidence}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground mb-2 block">Evidence:</span>
                          <div className="space-y-1">
                            {analysisData.evidence.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs">
                                <Flag className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
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
                ) : (
                  <>
                    {/* Chat History */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] ${
                              msg.type === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-accent"
                            } rounded-lg p-3`}>
                              <div className="text-sm whitespace-pre-line">{msg.message}</div>
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
                          placeholder="Ask about this flagged task..."
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