import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const kpiData = [
    {
      title: "QC Throughput",
      value: "847",
      unit: "reviews/day",
      change: "+23%",
      trending: "up",
      icon: BarChart3,
      description: "5x improvement vs baseline",
    },
    {
      title: "Rater Accuracy",
      value: "94.2%",
      unit: "gold pass rate",
      change: "+12%",
      trending: "up", 
      icon: CheckCircle,
      description: "On gold-standard tasks",
    },
    {
      title: "Active Raters",
      value: "1,247",
      unit: "users",
      change: "+8%",
      trending: "up",
      icon: Users,
      description: "Using AI assistant",
    },
    {
      title: "Avg Turnaround", 
      value: "2.4hrs",
      unit: "feedback time",
      change: "-45%",
      trending: "down",
      icon: Clock,
      description: "Time to QC feedback",
    },
  ];

  const flaggedRaters = [
    { id: "R001", name: "Alex Chen", riskScore: 0.78, reason: "Low accuracy on category classification", flaggedTasks: 12 },
    { id: "R045", name: "Maria Rodriguez", riskScore: 0.65, reason: "Inconsistent rating patterns", flaggedTasks: 8 },
    { id: "R123", name: "James Wilson", riskScore: 0.58, reason: "Fast completion anomalies", flaggedTasks: 15 },
  ];

  const recentActivity = [
    { id: 1, type: "workflow_published", user: "Admin Sarah", description: "Published new Content Moderation workflow", time: "2 hours ago" },
    { id: 2, type: "rater_flagged", user: "System", description: "Rater R045 flagged for review", time: "4 hours ago" },
    { id: 3, type: "kb_updated", user: "Admin Mike", description: "Updated guideline v2.1 - Safety Policy", time: "6 hours ago" },
    { id: 4, type: "plugin_deployed", user: "System", description: "Rater Plugin v1.2.1 deployed", time: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics and system overview
          </p>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <div className="w-2 h-2 bg-success rounded-full mr-2" />
          All Systems Operational
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trending === "up";
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-accent/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-primary" />
                  <Badge
                    variant="secondary"
                    className={`${
                      isPositive ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    } border-0`}
                  >
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {kpi.change}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {kpi.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {kpi.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Raters */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Flagged Raters
            </CardTitle>
            <CardDescription>
              Raters requiring attention based on behavioral and performance signals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flaggedRaters.map((rater) => (
                <div key={rater.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rater.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {rater.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rater.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Risk Score:</span>
                      <Progress 
                        value={rater.riskScore * 100} 
                        className="w-20 h-2"
                      />
                      <span className="text-xs font-medium">
                        {(rater.riskScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{rater.flaggedTasks}</div>
                    <div className="text-xs text-muted-foreground">flagged tasks</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and administrative actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}:</span>{" "}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;