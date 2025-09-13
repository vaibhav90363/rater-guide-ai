import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  Eye,
  MessageSquare,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const QCPlugin = () => {
  const [activeMode, setActiveMode] = useState("review");
  const [feedback, setFeedback] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const taskData = {
    taskId: "TSK_4567",
    raterId: "R001", 
    raterName: "Alex Chen",
    project: "Content Moderation",
    flaggedAt: "2024-01-15 14:23",
    riskScore: 0.78,
    disagreementScore: 2.4,
    
    originalContent: {
      type: "social_media_post",
      text: "Can't believe what's happening in politics these days. The upcoming election is going to be a disaster if we don't vote for change. Everyone needs to wake up and see what's really going on! #Election2024 #Change",
      metadata: {
        platform: "Twitter/X",
        timestamp: "2024-01-15 12:30",
        author: "@user_handle",
        engagement: "45 likes, 12 retweets, 8 comments"
      }
    },

    raterRating: {
      safety: "safe",
      category: "news_politics", 
      severity: "low",
      action: "approve",
      confidence: 0.72,
      reasoning: "Political opinion but no direct threats or harassment"
    },

    aiRating: {
      safety: "potentially_unsafe",
      category: "political_content",
      severity: "medium", 
      action: "flag_for_review",
      confidence: 0.89,
      reasoning: "Contains charged political language that could be divisive. Meets criteria for manual review per safety guidelines section 3.2.1"
    },

    evidence: [
      {
        type: "guideline",
        title: "Safety Policy v2.1 - Section 3.2.1",
        snippet: "Political content with inflammatory language or divisive rhetoric should be flagged for human review when confidence is medium or higher.",
        relevance: 0.94
      },
      {
        type: "similar_case",
        title: "Task TSK_4321",
        snippet: "Similar political content was correctly flagged - contains emotional appeals and divisive language",
        relevance: 0.87
      },
      {
        type: "keyword_analysis", 
        title: "Content Analysis Report",
        snippet: "95% political indicators detected, including 'disaster', 'wake up', emotional appeals",
        relevance: 0.82
      }
    ],

    raterHistory: {
      totalTasks: 1247,
      accuracy: 89.2,
      recentFlags: 3,
      aiAgreementRate: 67,
      avgSpeed: "2.3 min/task",
      lastFeedback: "2024-01-10 - Accuracy improvement needed on category classification"
    }
  };

  const getDifferenceHighlight = (raterValue: string, aiValue: string) => {
    if (raterValue !== aiValue) {
      return "border-l-4 border-l-destructive bg-destructive/5";
    }
    return "border-l-4 border-l-success bg-success/5";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QC Plugin Interface</h1>
          <p className="text-muted-foreground mt-1">
            Review flagged tasks with AI-powered analysis and comparison tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Flagged Task
          </Badge>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            High Priority
          </Badge>
        </div>
      </div>

      {/* Task Overview */}
      <Card className="shadow-enterprise border-l-4 border-l-warning">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-warning" />
                QC Review: {taskData.taskId}
              </CardTitle>
              <CardDescription>
                Rater: {taskData.raterName} ({taskData.raterId}) • {taskData.project} • Flagged: {taskData.flaggedAt}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-destructive">
                Risk Score: {(taskData.riskScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Disagreement: {taskData.disagreementScore} points
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Review Interface */}
        <div className="xl:col-span-3 space-y-6">
          <Tabs value={activeMode} onValueChange={setActiveMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="review" className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Review & Compare
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Mode
              </TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="space-y-6">
              {/* Original Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Original Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent/30 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Social Media Post</div>
                    <blockquote className="text-foreground border-l-4 border-primary pl-4 italic">
                      "{taskData.originalContent.text}"
                    </blockquote>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>Platform: {taskData.originalContent.metadata.platform}</div>
                      <div>Posted: {taskData.originalContent.metadata.timestamp}</div>
                      <div>Author: {taskData.originalContent.metadata.author}</div>
                      <div>Engagement: {taskData.originalContent.metadata.engagement}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Rater Rating
                    </CardTitle>
                    <CardDescription>By {taskData.raterName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(taskData.raterRating).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg ${getDifferenceHighlight(String(value), String(taskData.aiRating[key as keyof typeof taskData.aiRating]))}`}>
                        <div className="flex justify-between">
                          <span className="capitalize text-sm font-medium">{key.replace('_', ' ')}</span>
                          <span className="font-semibold">{String(value).replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                      <div className="text-sm font-medium mb-1">Reasoning:</div>
                      <div className="text-xs text-red-700">{taskData.raterRating.reasoning}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      AI Recommendation
                    </CardTitle>
                    <CardDescription>
                      {(taskData.aiRating.confidence * 100).toFixed(0)}% confidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(taskData.aiRating).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg ${getDifferenceHighlight(String(taskData.raterRating[key as keyof typeof taskData.raterRating]), String(value))}`}>
                        <div className="flex justify-between">
                          <span className="capitalize text-sm font-medium">{key.replace('_', ' ')}</span>
                          <span className="font-semibold">{String(value).replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-medium mb-1">AI Reasoning:</div>
                      <div className="text-xs text-green-700">{taskData.aiRating.reasoning}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Supporting Evidence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Supporting Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {taskData.evidence.map((item, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{item.title}</div>
                            <div className="text-sm text-muted-foreground mb-2">{item.snippet}</div>
                            <Badge variant="outline" className="text-xs">
                              {(item.relevance * 100).toFixed(0)}% relevant
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* QC Decision */}
              <Card className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle>QC Decision & Feedback</CardTitle>
                  <CardDescription>
                    Make your decision and provide structured feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant={selectedAction === "approve_rater" ? "default" : "outline"}
                      onClick={() => setSelectedAction("approve_rater")}
                      className="h-16 flex-col"
                    >
                      <CheckCircle className="w-6 h-6 mb-1" />
                      Approve Rater
                    </Button>
                    <Button 
                      variant={selectedAction === "approve_ai" ? "default" : "outline"}
                      onClick={() => setSelectedAction("approve_ai")}
                      className="h-16 flex-col"
                    >
                      <ThumbsUp className="w-6 h-6 mb-1" />
                      Approve AI
                    </Button>
                    <Button 
                      variant={selectedAction === "custom" ? "default" : "outline"}
                      onClick={() => setSelectedAction("custom")}
                      className="h-16 flex-col"
                    >
                      <XCircle className="w-6 h-6 mb-1" />
                      Custom Decision
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="action-type">Feedback Category</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guideline_clarification">Guideline Clarification</SelectItem>
                          <SelectItem value="accuracy_improvement">Accuracy Improvement</SelectItem>
                          <SelectItem value="context_analysis">Context Analysis</SelectItem>
                          <SelectItem value="consistent_application">Consistent Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="feedback">Detailed Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Provide specific, actionable feedback with references to guidelines and examples..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Recommended Actions</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          "Send feedback to rater",
                          "Require additional training", 
                          "Flag for increased monitoring",
                          "Escalate to operations team"
                        ].map((action) => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox id={action} />
                            <label htmlFor={action} className="text-sm">{action}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-primary" disabled={!selectedAction}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit QC Decision
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>QC Assistant Chat</CardTitle>
                  <CardDescription>
                    Ask questions about guidelines, get clarification on edge cases, or request additional analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p>Chat interface for QC assistant coming soon...</p>
                    <p className="text-sm mt-1">Ask about guidelines, request analysis, or get help with decision making</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rater Profile Summary */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Rater Profile</CardTitle>
              <CardDescription>{taskData.raterName} ({taskData.raterId})</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks:</span>
                  <span className="font-medium">{taskData.raterHistory.totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">{taskData.raterHistory.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recent Flags:</span>
                  <span className="font-medium text-warning">{taskData.raterHistory.recentFlags}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Agreement:</span>
                  <span className="font-medium">{taskData.raterHistory.aiAgreementRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Speed:</span>
                  <span className="font-medium">{taskData.raterHistory.avgSpeed}</span>
                </div>
              </div>
              
              <div className="bg-accent/30 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Last Feedback:</div>
                <div className="text-xs text-muted-foreground">
                  {taskData.raterHistory.lastFeedback}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                QC Queue Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Reviews:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Today:</span>
                  <span className="font-medium text-success">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Review Time:</span>
                  <span className="font-medium">4.2 min</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                View Full Queue
              </Button>
            </CardContent>
          </Card>

          {/* Actions History */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-2 border-success pl-3">
                  <div className="text-sm font-medium">Task approved</div>
                  <div className="text-xs text-muted-foreground">TSK_4566 - 10 min ago</div>
                </div>
                <div className="border-l-2 border-warning pl-3">
                  <div className="text-sm font-medium">Feedback sent</div>
                  <div className="text-xs text-muted-foreground">R045 - 25 min ago</div>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <div className="text-sm font-medium">Custom decision</div>
                  <div className="text-xs text-muted-foreground">TSK_4564 - 1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QCPlugin;