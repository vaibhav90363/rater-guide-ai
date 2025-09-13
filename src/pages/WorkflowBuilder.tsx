import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Play,
  Save,
  GitBranch,
  Database,
  MessageSquare,
  Filter,
  Zap,
  BarChart3,
  Link,
  Sparkles,
  Settings,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const WorkflowBuilder = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState("Content Moderation Workflow");

  const nodeTypes = [
    {
      id: "input",
      title: "Input Source", 
      icon: Database,
      description: "Connect to task data sources",
      color: "bg-blue-500",
    },
    {
      id: "knowledge",
      title: "Knowledge Base",
      icon: GitBranch,
      description: "Link guideline documents",
      color: "bg-green-500", 
    },
    {
      id: "prompt", 
      title: "AI Prompt",
      icon: MessageSquare,
      description: "Configure system prompts",
      color: "bg-purple-500",
    },
    {
      id: "filter",
      title: "Data Filter",
      icon: Filter, 
      description: "Apply field filters and sampling",
      color: "bg-orange-500",
    },
    {
      id: "action",
      title: "Action Node", 
      icon: Zap,
      description: "Define flagging and escalation actions",
      color: "bg-red-500",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      description: "Configure metrics and tracking",
      color: "bg-teal-500",
    },
    {
      id: "connector",
      title: "External API",
      icon: Link,
      description: "Connect to external services",
      color: "bg-indigo-500",
    },
  ];

  const workflow = {
    nodes: [
      {
        id: "node1", 
        type: "input",
        title: "Task Source",
        position: { x: 100, y: 100 },
        configured: true,
      },
      {
        id: "node2",
        type: "knowledge", 
        title: "Safety Guidelines v2.1",
        position: { x: 300, y: 100 },
        configured: true,
      },
      {
        id: "node3",
        type: "prompt",
        title: "Content Review Prompt", 
        position: { x: 500, y: 100 },
        configured: false,
      },
      {
        id: "node4",
        type: "action",
        title: "Flag High Risk Content",
        position: { x: 300, y: 250 },
        configured: false,
      },
    ],
    connections: [
      { from: "node1", to: "node2" },
      { from: "node2", to: "node3" },
      { from: "node3", to: "node4" },
    ]
  };

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(n => n.id === type);
    return nodeType?.icon || GitBranch;
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(n => n.id === type);
    return nodeType?.color || "bg-gray-500";
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflow Builder</h1>
          <p className="text-muted-foreground mt-1">
            Design and configure rating workflows with drag-and-drop nodes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Workflow Generator</DialogTitle>
                <DialogDescription>
                  Describe your workflow requirements and let AI create the initial setup for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workflow-desc">Workflow Description</Label>
                  <Textarea 
                    id="workflow-desc"
                    placeholder="E.g., Content moderation workflow for social media posts that checks for harmful content, applies safety guidelines, and flags violations..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <Button className="w-full bg-gradient-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Test Run
          </Button>
          <Button className="bg-gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{workflowName}</CardTitle>
              <CardDescription>Version 1.2 • Last saved 5 minutes ago</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Node Palette */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Node Palette</CardTitle>
              <CardDescription>Drag nodes to build your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nodeTypes.map((nodeType) => {
                  const Icon = nodeType.icon;
                  return (
                    <div
                      key={nodeType.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors"
                    >
                      <div className={`w-8 h-8 ${nodeType.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{nodeType.title}</div>
                        <div className="text-xs text-muted-foreground">{nodeType.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Workflow Canvas</CardTitle>
            </CardHeader>
            <CardContent className="relative h-96 bg-accent/20 rounded-lg overflow-hidden">
              {/* Workflow Nodes */}
              {workflow.nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const nodeColor = getNodeColor(node.type);
                
                return (
                  <div
                    key={node.id}
                    className={`absolute w-40 p-3 bg-card border border-border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                    style={{ 
                      left: `${node.position.x}px`, 
                      top: `${node.position.y}px` 
                    }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 ${nodeColor} rounded flex items-center justify-center`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={node.configured ? "border-success text-success" : "border-warning text-warning"}
                      >
                        {node.configured ? "✓" : "!"}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-foreground">{node.title}</div>
                  </div>
                );
              })}

              {/* Connection Lines (simplified) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {workflow.connections.map((connection, index) => {
                  const fromNode = workflow.nodes.find(n => n.id === connection.from);
                  const toNode = workflow.nodes.find(n => n.id === connection.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={fromNode.position.x + 80}
                      y1={fromNode.position.y + 25}
                      x2={toNode.position.x + 80}
                      y2={toNode.position.y + 25}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                  </marker>
                </defs>
              </svg>

              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)`,
                     backgroundSize: '20px 20px'
                   }} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Properties</CardTitle>
              <CardDescription>
                {selectedNode ? "Configure selected node" : "Select a node to edit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="node-name">Node Name</Label>
                    <Input 
                      id="node-name" 
                      placeholder="Enter node name..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input 
                      id="timeout"
                      type="number" 
                      placeholder="30"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retry">Retry Policy</Label>
                    <Input 
                      id="retry"
                      type="number"
                      placeholder="3"
                      className="mt-2"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="w-8 h-8 mx-auto mb-2" />
                  <p>Select a node to configure its properties</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <GitBranch className="w-4 h-4 mr-2" />
                Create Branch
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;