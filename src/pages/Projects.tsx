import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FolderOpen,
  Users,
  GitBranch,
  Calendar,
  MoreVertical,
  Play,
  Pause,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = [
    {
      id: "PRJ001",
      name: "Content Moderation - Social Media",
      description: "Automated content review for social media platform with safety guidelines",
      status: "active",
      raterCount: 156,
      qcThroughput: "847 reviews/day", 
      accuracy: "94.2%",
      createdAt: "2024-01-15",
      workflows: 3,
      guidelines: "Safety Policy v2.1",
      lastActivity: "2 hours ago",
    },
    {
      id: "PRJ002", 
      name: "E-commerce Product Reviews",
      description: "Quality assessment of product reviews for authenticity and helpfulness",
      status: "active",
      raterCount: 89,
      qcThroughput: "312 reviews/day",
      accuracy: "91.8%", 
      createdAt: "2024-02-03",
      workflows: 2,
      guidelines: "Product Review Guidelines v1.5",
      lastActivity: "1 day ago",
    },
    {
      id: "PRJ003",
      name: "Legal Document Analysis",
      description: "Classification and extraction from legal contracts and agreements", 
      status: "paused",
      raterCount: 23,
      qcThroughput: "124 reviews/day",
      accuracy: "96.1%",
      createdAt: "2023-11-28",
      workflows: 5,
      guidelines: "Legal Analysis Framework v3.0",
      lastActivity: "5 days ago",
    },
    {
      id: "PRJ004",
      name: "Medical Image Annotation",
      description: "Radiological image review and diagnostic annotation workflow",
      status: "active", 
      raterCount: 34,
      qcThroughput: "89 reviews/day",
      accuracy: "98.3%",
      createdAt: "2024-01-22",
      workflows: 1,
      guidelines: "Medical Imaging Standards v2.0",
      lastActivity: "30 minutes ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "paused": 
        return "bg-warning/10 text-warning border-warning/20";
      case "draft":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage rating and QC projects across your organization
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Project Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {project.status === "active" ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Project
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Resume Project
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-accent/50 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{project.raterCount}</div>
                    <div className="text-xs text-muted-foreground">Active Raters</div>
                  </div>
                  <div className="text-center p-3 bg-accent/50 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{project.accuracy}</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-accent/50 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{project.workflows}</div>
                    <div className="text-xs text-muted-foreground">Workflows</div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>QC Throughput: {project.qcThroughput}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span>Guidelines: {project.guidelines}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Last activity: {project.lastActivity}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Dashboard
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage Workflows
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first project to get started"
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;