import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  CheckSquare,
  Bot,
  Sparkles,
  Send,
  BookOpen,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  History,
  CreditCard,
  Camera,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RaterPlugin = () => {
  const [activeMode, setActiveMode] = useState("rate");
  const [chatMessage, setChatMessage] = useState("");
  const [checklist, setChecklist] = useState({
    content_reviewed: false,
    guideline_checked: false,
    context_analyzed: false,
    confidence_assessed: false,
  });

  const aiSuggestion = {
    rating: {
      safety: "unsafe",
      category: "political_content", 
      severity: "medium",
      action: "flag_for_review",
    },
    confidence: 0.87,
    reasoning: "Content contains political messaging with potential for controversy. Safety guidelines section 3.2.1 indicates this should be flagged for human review.",
    evidence: [
      "Political content policy (Section 3.2.1)",
      "Similar case: TSK_4321 - flagged correctly",
      "Keyword analysis: 95% political indicators",
    ],
    suggestedNext: "Review context for additional nuance before final decision",
  };

  const chatHistory = [
    {
      id: 1,
      type: "user",
      message: "What does the safety policy say about political content in social media posts?",
      timestamp: "14:23",
    },
    {
      id: 2,
      type: "assistant", 
      message: "According to Section 3.2.1 of the Safety Policy Guidelines v2.1, political content should be evaluated for:\n\n1. **Inflammatory language** - Check for divisive rhetoric\n2. **Misinformation potential** - Verify factual claims\n3. **Harassment targeting** - Look for attacks on individuals\n\nPolitical opinions alone are generally allowed unless they violate other community standards.",
      timestamp: "14:23",
      citations: ["Safety Policy v2.1 - Section 3.2.1", "Community Standards - Political Content"],
    },
    {
      id: 3,
      type: "user",
      message: "How should I rate this specific post about upcoming elections?",
      timestamp: "14:24",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rater Plugin Interface</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered assistant for rating tasks with contextual guidance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-success/10 text-success">
            <div className="w-2 h-2 bg-success rounded-full mr-2" />
            Plugin Active
          </Badge>
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Take Screenshot
          </Button>
        </div>
      </div>

      {/* Plugin Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Plugin Window */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-enterprise">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <CardTitle>AI Rater Assistant</CardTitle>
                </div>
                <Badge variant="outline" className="bg-gradient-primary text-white border-0">
                  Premium
                </Badge>
              </div>
              <CardDescription>
                Get AI-powered suggestions and guideline assistance for your rating tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat Mode
                  </TabsTrigger>
                  <TabsTrigger value="rate" className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Rate Mode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="space-y-4 mt-6">
                  {/* Chat History */}
                  <div className="space-y-3 max-h-80 overflow-y-auto bg-accent/20 rounded-lg p-4">
                    {chatHistory.map((message) => (
                      <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === "user" 
                            ? "bg-primary text-primary-foreground ml-auto" 
                            : "bg-card border border-border"
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                          <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                          {message.citations && (
                            <div className="mt-2 space-y-1">
                              {message.citations.map((citation, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs">
                                  <BookOpen className="w-3 h-3" />
                                  <span className="text-primary hover:underline cursor-pointer">
                                    {citation}
                                  </span>
                                  <ExternalLink className="w-3 h-3" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about guidelines, policies, or get help with this task..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && setChatMessage("")}
                    />
                    <Button onClick={() => setChatMessage("")} className="bg-gradient-primary">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setChatMessage("What does the guideline say about this type of content?")}>
                      Check Guidelines
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setChatMessage("Show me similar examples")}>
                      Similar Examples
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setChatMessage("What are the key factors to consider?")}>
                      Key Factors
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="rate" className="space-y-4 mt-6">
                  {/* Rating Checklist */}
                  <Card className="bg-accent/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        Rating Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { id: "content_reviewed", label: "Content thoroughly reviewed", guideline: "Section 2.1 - Content Review Process" },
                        { id: "guideline_checked", label: "Relevant guidelines consulted", guideline: "Always reference applicable sections" },
                        { id: "context_analyzed", label: "Context and intent analyzed", guideline: "Section 4.3 - Context Analysis" },
                        { id: "confidence_assessed", label: "Confidence level evaluated", guideline: "Rate certainty on 1-10 scale" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={item.id}
                            checked={checklist[item.id as keyof typeof checklist]}
                            onCheckedChange={(checked) => 
                              setChecklist(prev => ({ ...prev, [item.id]: checked }))
                            }
                          />
                          <div className="flex-1">
                            <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                              {item.label}
                            </label>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <BookOpen className="w-3 h-3" />
                              {item.guideline}
                              <ExternalLink className="w-3 h-3 cursor-pointer hover:text-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* AI Suggestion */}
                  <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Suggestion
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {(aiSuggestion.confidence * 100).toFixed(0)}% confident
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Suggested Rating */}
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(aiSuggestion.rating).map(([key, value]) => (
                          <div key={key} className="bg-card p-3 rounded-lg border">
                            <div className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}</div>
                            <div className="font-semibold text-foreground">{String(value).replace('_', ' ')}</div>
                          </div>
                        ))}
                      </div>

                      {/* Confidence Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>AI Confidence</span>
                          <span>{(aiSuggestion.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={aiSuggestion.confidence * 100} className="h-2" />
                      </div>

                      {/* Reasoning */}
                      <div className="bg-accent/50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Reasoning:</h4>
                        <p className="text-sm text-muted-foreground">{aiSuggestion.reasoning}</p>
                      </div>

                      {/* Evidence */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Supporting Evidence:</h4>
                        <div className="space-y-1">
                          {aiSuggestion.evidence.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              <span className="text-primary hover:underline cursor-pointer">{item}</span>
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Accept Suggestion
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Modify Rating
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground bg-warning/10 p-2 rounded border border-warning/20">
                        💡 Suggestion: {aiSuggestion.suggestedNext}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Context */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Current Task</CardTitle>
              <CardDescription>TSK_4567 - Content Moderation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-accent/30 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Task Preview</div>
                <div className="text-xs text-muted-foreground">
                  Social media post containing political commentary about upcoming elections...
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">Content Moderation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guidelines:</span>
                  <span className="font-medium">Safety Policy v2.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant="outline" className="text-xs">Standard</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-2 border-success pl-3">
                  <div className="text-sm font-medium">Task completed</div>
                  <div className="text-xs text-muted-foreground">TSK_4566 - 5 minutes ago</div>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <div className="text-sm font-medium">AI suggestion accepted</div>
                  <div className="text-xs text-muted-foreground">TSK_4565 - 12 minutes ago</div>
                </div>
                <div className="border-l-2 border-warning pl-3">
                  <div className="text-sm font-medium">Feedback received</div>
                  <div className="text-xs text-muted-foreground">Accuracy improvement - 2 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage & Billing */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Usage & Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AI Suggestions Today</span>
                  <span className="font-medium">23/50</span>
                </div>
                <Progress value={46} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chat Queries</span>
                  <span className="font-medium">12/100</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaterPlugin;