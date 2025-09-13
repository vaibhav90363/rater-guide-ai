import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  AlertTriangle, 
  User, 
  Clock, 
  TrendingUp,
  Bot,
  Flag,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";

interface QCPlatformProps {
  onPluginToggle: () => void;
  showPlugin: boolean;
}

const QCPlatform = ({ onPluginToggle, showPlugin }: QCPlatformProps) => {
  const [selectedTask, setSelectedTask] = useState("TASK-2024-001234");

  const flaggedTasks = [
    {
      id: "TASK-2024-001234",
      raterId: "RATER-456",
      raterName: "Sarah Johnson",
      flagReason: "Low confidence rating",
      severity: "medium",
      submittedAt: "2024-01-15 14:30:22",
      originalRating: "Good",
      suggestedRating: "Fair",
      content: "This product exceeded my expectations! The build quality is excellent...",
      riskScore: 0.73
    },
    {
      id: "TASK-2024-001235", 
      raterId: "RATER-789",
      raterName: "Mike Chen",
      flagReason: "Inconsistent with guidelines",
      severity: "high",
      submittedAt: "2024-01-15 14:28:15",
      originalRating: "Excellent",
      suggestedRating: "Poor",
      content: "Terrible product, completely broke after one day of use...",
      riskScore: 0.91
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const selectedTaskData = flaggedTasks.find(task => task.id === selectedTask);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">QC Review Dashboard</h1>
            <Badge variant="outline" className="text-xs">
              {flaggedTasks.length} tasks pending
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Reviewed: 23/26 tasks today
            </div>
            <Button 
              onClick={onPluginToggle}
              variant="outline" 
              size="sm"
              className="relative"
            >
              <Bot className="w-4 h-4 mr-2" />
              QC Assistant
              {!showPlugin && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Flagged Tasks List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Flagged Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {flaggedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className={`p-3 border-l-2 cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedTask === task.id
                        ? 'bg-accent border-l-primary'
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono">{task.id}</span>
                        <Badge className={getSeverityColor(task.severity)} variant="outline">
                          {task.severity}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{task.raterName}</div>
                        <div className="text-xs text-muted-foreground">{task.flagReason}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Risk: {(task.riskScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Review */}
        <div className="lg:col-span-3 space-y-6">
          {selectedTaskData && (
            <>
              {/* Task Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Task Review - {selectedTaskData.id}
                    </CardTitle>
                    <Badge className={getSeverityColor(selectedTaskData.severity)}>
                      {selectedTaskData.severity} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="ratings">Rating Comparison</TabsTrigger>
                      <TabsTrigger value="rater">Rater Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-4">
                      <div className="space-y-4">
                        <div className="bg-accent/30 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed">{selectedTaskData.content}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Submitted:</span> {selectedTaskData.submittedAt}
                          </div>
                          <div>
                            <span className="font-medium">Flag Reason:</span> {selectedTaskData.flagReason}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ratings" className="mt-4">
                      <div className="grid grid-cols-2 gap-6">
                        <Card className="border-destructive/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-destructive">Rater's Rating</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">{selectedTaskData.originalRating}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              By {selectedTaskData.raterName}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-success/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-success">AI Suggested</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">{selectedTaskData.suggestedRating}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Confidence: 87%
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                        <div className="text-sm">
                          <strong>Discrepancy:</strong> Rater rated higher than AI suggestion. 
                          This may indicate over-optimistic rating or guideline misinterpretation.
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rater" className="mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs">Accuracy Rate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">87.3%</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs">Total Flags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold">12</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs">Risk Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold text-warning">
                              {(selectedTaskData.riskScore * 100).toFixed(1)}%
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* QC Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">QC Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button variant="outline" className="text-success border-success/20 hover:bg-success/10">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Rating
                    </Button>
                    <Button variant="outline" className="text-warning border-warning/20 hover:bg-warning/10">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Request Revision
                    </Button>
                    <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-2" />
                      Override Rating
                    </Button>
                    <Button variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      Send Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QCPlatform;