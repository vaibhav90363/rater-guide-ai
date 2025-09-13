import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Eye,
  MessageSquare,
  UserX,
  CheckCircle,
  Clock,
  Filter,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const QCDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");

  const flaggedReviews = [
    {
      id: "QC001",
      taskId: "TSK_4567",
      raterId: "R001",
      raterName: "Alex Chen",
      project: "Content Moderation",
      riskScore: 0.78,
      disagreementScore: 2.4,
      flagReason: "Low accuracy on category classification",
      raterRating: { safety: "safe", category: "news", confidence: 0.72 },
      aiRating: { safety: "unsafe", category: "political", confidence: 0.89 },
      flaggedAt: "2024-01-15 14:23",
      priority: "high",
      status: "pending",
      evidence: ["Guideline section 3.2.1", "Similar case TSK_4321"],
      qcAssignee: null,
    },
    {
      id: "QC002", 
      taskId: "TSK_4892",
      raterId: "R045",
      raterName: "Maria Rodriguez",
      project: "Product Reviews",
      riskScore: 0.65,
      disagreementScore: 1.8,
      flagReason: "Inconsistent rating patterns detected",
      raterRating: { authenticity: "authentic", helpfulness: 8, sentiment: "positive" },
      aiRating: { authenticity: "suspicious", helpfulness: 4, sentiment: "neutral" },
      flaggedAt: "2024-01-15 13:45", 
      priority: "medium",
      status: "in_review",
      evidence: ["Pattern analysis report", "Historical comparison"],
      qcAssignee: "QC Sarah Johnson",
    },
    {
      id: "QC003",
      taskId: "TSK_5123", 
      raterId: "R123",
      raterName: "James Wilson",
      project: "Legal Documents",
      riskScore: 0.58,
      disagreementScore: 3.2,
      flagReason: "Fast completion anomaly - 30s vs 4min avg",
      raterRating: { docType: "contract", complexity: "simple", extractable: true },
      aiRating: { docType: "agreement", complexity: "complex", extractable: false },
      flaggedAt: "2024-01-15 12:10",
      priority: "high", 
      status: "pending",
      evidence: ["Speed analysis", "Complexity assessment"],
      qcAssignee: null,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "in_review":
        return "bg-primary/10 text-primary border-primary/20";
      case "resolved":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredReviews = flaggedReviews.filter((review) => {
    const matchesSearch = review.raterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || review.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QC Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Review flagged tasks and manage quality control processes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            {flaggedReviews.filter(r => r.status === "pending").length} Pending Reviews
          </Badge>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Filter className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-warning" />
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Urgent
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {flaggedReviews.filter(r => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg wait: 2.3 hours
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                In Progress
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {flaggedReviews.filter(r => r.status === "in_review").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              By QC team
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                High Risk
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {flaggedReviews.filter(r => r.priority === "high").length}
            </div>
             <p className="text-xs text-muted-foreground mt-1">
               Risk score &gt;0.7
             </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-success" />
              <Badge variant="secondary" className="bg-success/10 text-success">
                Today
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              +40% vs yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Flagged Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Review {review.id}
                        </h3>
                        <Badge className={getPriorityColor(review.priority)}>
                          {review.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(review.status)}>
                          {review.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Task {review.taskId} • {review.project} • Flagged {review.flaggedAt}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserX className="w-4 h-4 mr-2" />
                        Escalate to Appeals
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Rater Info & Risk Score */}
                <div className="bg-accent/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Rater: {review.raterName} ({review.raterId})
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.flagReason}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-destructive">
                        Risk: {(review.riskScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Disagreement: {review.disagreementScore}pts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-700">Rater Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {Object.entries(review.raterRating).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize text-red-600">{key}:</span>
                            <span className="font-medium text-red-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-700">AI Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {Object.entries(review.aiRating).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize text-green-600">{key}:</span>
                            <span className="font-medium text-green-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Evidence & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-sm text-muted-foreground mr-2">Evidence:</span>
                    {review.evidence.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Feedback
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Feedback to Rater</DialogTitle>
                          <DialogDescription>
                            Provide structured feedback to {review.raterName} about task {review.taskId}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="feedback-type">Feedback Type</Label>
                            <Select>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select feedback type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="guideline_clarification">Guideline Clarification</SelectItem>
                                <SelectItem value="accuracy_improvement">Accuracy Improvement</SelectItem>
                                <SelectItem value="speed_concern">Speed Concern</SelectItem>
                                <SelectItem value="pattern_issue">Pattern Issue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="feedback-message">Feedback Message</Label>
                            <Textarea 
                              id="feedback-message"
                              placeholder="Provide detailed feedback with specific examples and improvement suggestions..."
                              className="mt-2"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="action">Recommended Action</Label>
                            <Select>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="feedback_only">Feedback Only</SelectItem>
                                <SelectItem value="retrain">Require Retraining</SelectItem>
                                <SelectItem value="temporary_review">Temporary Additional Review</SelectItem>
                                <SelectItem value="escalate">Escalate to Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full bg-gradient-primary">
                            Send Feedback & Resolve
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant={review.status === "pending" ? "default" : "outline"} 
                      size="sm"
                      className={review.status === "pending" ? "bg-primary" : ""}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {review.status === "pending" ? "Start Review" : "Continue Review"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reviews found</h3>
          <p className="text-muted-foreground">
            {searchTerm || priorityFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "All caught up! No flagged reviews requiring attention"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default QCDashboard;