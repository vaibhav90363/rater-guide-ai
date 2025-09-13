import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Clock,
  MoreVertical,
  MessageSquare,
  Ban,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RaterProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const raters = [
    {
      id: "R001",
      name: "Alex Chen",
      email: "alex.chen@example.com",
      status: "active",
      riskScore: 0.78,
      accuracy: 89.2,
      totalTasks: 1247,
      completedToday: 23,
      avgSpeed: "2.3 min/task",
      joinedAt: "2023-08-15",
      lastActive: "5 minutes ago",
      flags: 3,
      feedback: 2,
      projects: ["Content Moderation", "Product Reviews"],
      tenure: "8 months",
      aiAcceptanceRate: 67,
    },
    {
      id: "R045", 
      name: "Maria Rodriguez",
      email: "maria.rodriguez@example.com",
      status: "active",
      riskScore: 0.23,
      accuracy: 96.8,
      totalTasks: 2134,
      completedToday: 31,
      avgSpeed: "1.8 min/task",
      joinedAt: "2023-03-22",
      lastActive: "2 hours ago",
      flags: 0,
      feedback: 1,
      projects: ["Legal Documents", "Medical Imaging"],
      tenure: "1.2 years",
      aiAcceptanceRate: 89,
    },
    {
      id: "R123",
      name: "James Wilson",
      email: "james.wilson@example.com", 
      status: "flagged",
      riskScore: 0.58,
      accuracy: 91.5,
      totalTasks: 856,
      completedToday: 8,
      avgSpeed: "4.1 min/task",
      joinedAt: "2023-11-08",
      lastActive: "1 day ago",
      flags: 2,
      feedback: 4,
      projects: ["Content Moderation"],
      tenure: "4 months",
      aiAcceptanceRate: 34,
    },
    {
      id: "R089",
      name: "Sarah Kim",
      email: "sarah.kim@example.com",
      status: "active", 
      riskScore: 0.15,
      accuracy: 97.2,
      totalTasks: 1889,
      completedToday: 27,
      avgSpeed: "1.9 min/task",
      joinedAt: "2023-01-10",
      lastActive: "30 minutes ago",
      flags: 0,
      feedback: 0,
      projects: ["Legal Documents", "Product Reviews", "Medical Imaging"],
      tenure: "1.5 years",
      aiAcceptanceRate: 92,
    },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 0.7) return "text-destructive";
    if (score >= 0.5) return "text-warning"; 
    if (score >= 0.3) return "text-primary";
    return "text-success";
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 0.7) return "bg-destructive/10 text-destructive border-destructive/20";
    if (score >= 0.5) return "bg-warning/10 text-warning border-warning/20";
    if (score >= 0.3) return "bg-primary/10 text-primary border-primary/20";
    return "bg-success/10 text-success border-success/20";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "flagged":
        return "bg-warning/10 text-warning border-warning/20";
      case "suspended":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredRaters = raters.filter((rater) => {
    const matchesSearch = rater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rater.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rater.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rater.status === statusFilter;
    const matchesRisk = riskFilter === "all" || 
                       (riskFilter === "high" && rater.riskScore >= 0.7) ||
                       (riskFilter === "medium" && rater.riskScore >= 0.3 && rater.riskScore < 0.7) ||
                       (riskFilter === "low" && rater.riskScore < 0.3);
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rater Profiles</h1>
          <p className="text-muted-foreground mt-1">
            Monitor rater performance, behavior patterns, and quality metrics
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {raters.length} Active Raters
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-primary" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Raters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {raters.filter(r => r.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Star className="w-5 h-5 text-primary" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              93.7%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.3% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <TrendingDown className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flagged Raters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {raters.filter(r => r.status === "flagged").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -25% vs last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-success" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              70.5%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search raters..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rater Cards */}
      <div className="space-y-4">
        {filteredRaters.map((rater) => (
          <Card key={rater.id} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {rater.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground">{rater.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {rater.id}
                      </Badge>
                      <Badge className={getStatusColor(rater.status)}>
                        {rater.status}
                      </Badge>
                      <Badge className={getRiskBadgeColor(rater.riskScore)}>
                        Risk: {(rater.riskScore * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {rater.email} • Joined {rater.joinedAt} • {rater.tenure} tenure
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold text-foreground">{rater.accuracy}%</div>
                          {rater.accuracy >= 95 ? (
                            <Star className="w-4 h-4 text-warning" />
                          ) : rater.accuracy >= 90 ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">AI Acceptance</div>
                        <div className="space-y-1">
                          <div className="text-lg font-semibold text-foreground">{rater.aiAcceptanceRate}%</div>
                          <Progress value={rater.aiAcceptanceRate} className="h-1" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Tasks Today</div>
                        <div className="text-lg font-semibold text-foreground">{rater.completedToday}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Avg Speed</div>
                        <div className="text-lg font-semibold text-foreground">{rater.avgSpeed}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {rater.projects.map((project) => (
                        <Badge key={project} variant="secondary" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last active: {rater.lastActive}
                      </span>
                      {rater.flags > 0 && (
                        <span className="flex items-center gap-1 text-warning">
                          <AlertTriangle className="w-3 h-3" />
                          {rater.flags} flags
                        </span>
                      )}
                      {rater.feedback > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {rater.feedback} feedback
                        </span>
                      )}
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
                      <UserCheck className="w-4 h-4 mr-2" />
                      View Full Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Feedback
                    </DropdownMenuItem>
                    {rater.status === "active" ? (
                      <DropdownMenuItem className="text-warning">
                        <Ban className="w-4 h-4 mr-2" />
                        Temporary Suspend
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-success">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reactivate Rater
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRaters.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No raters found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || riskFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No raters have been added to the system yet"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RaterProfiles;