import { useState } from "react";
import { useParams, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, GitBranch, BookOpen, BarChart3, Monitor } from "lucide-react";
import WorkflowBuilder from "./WorkflowBuilder";
import KnowledgeBase from "./KnowledgeBase";
import RaterProfiles from "./RaterProfiles";
import QCDashboard from "./QCDashboard";
import UIDesigner from "./UIDesigner";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  const projectData = {
    "rater-pq-grid": {
      name: "Rater PQ Grid Project",
      description: "Content quality rating with grid-based evaluation system",
      status: "active",
      type: "rater",
      stats: {
        raters: 156,
        throughput: "847 reviews/day",
        accuracy: "94.2%",
        workflows: 3
      }
    },
    "qc-internal-flags": {
      name: "QC Internal Flags Project", 
      description: "Internal quality control and flagging system for review processes",
      status: "active",
      type: "qc",
      stats: {
        qcReviewers: 23,
        flaggedTasks: 124,
        accuracy: "96.1%",
        workflows: 2
      }
    }
  };

  const project = projectData[projectId as keyof typeof projectData];

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const getDashboardComponent = () => {
    if (project.type === "rater") {
      return <RaterProfiles />;
    } else {
      return <QCDashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <NavLink to="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </NavLink>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <Badge className="bg-success/10 text-success border-success/20">
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Project Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(project.stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="workflow">
            <GitBranch className="w-4 h-4 mr-2" />
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="w-4 h-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="ui-designer">
            <Monitor className="w-4 h-4 mr-2" />
            UI Designer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {getDashboardComponent()}
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <WorkflowBuilder />
        </TabsContent>

        <TabsContent value="knowledge" className="mt-6">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="ui-designer" className="mt-6">
          <div className="h-[calc(100vh-200px)]">
            <UIDesigner projectType={project.type} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;