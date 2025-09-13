import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  Bot
} from "lucide-react";

interface RaterPlatformProps {
  onPluginToggle: () => void;
  showPlugin: boolean;
}

const RaterPlatform = ({ onPluginToggle, showPlugin }: RaterPlatformProps) => {
  const [selectedRating, setSelectedRating] = useState("");
  const [comments, setComments] = useState("");
  const [qualityChecks, setQualityChecks] = useState({
    relevance: false,
    accuracy: false,
    completeness: false,
    clarity: false
  });

  const taskData = {
    id: "TASK-2024-001234",
    title: "Content Quality Assessment - Product Review",
    content: "This product exceeded my expectations! The build quality is excellent and it arrived quickly. The packaging was professional and everything was well-protected. I've been using it for two weeks now and it performs exactly as advertised. Highly recommend to anyone looking for a reliable solution.",
    metadata: {
      source: "E-commerce Platform",
      category: "Electronics Review",
      language: "English",
      submittedAt: "2024-01-15 14:30:22"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">RateHub Pro</h1>
            <Badge variant="outline" className="text-xs">
              Task #{taskData.id}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Progress: 47/50 tasks
            </div>
            <Progress value={94} className="w-24" />
            <Button 
              onClick={onPluginToggle}
              variant="outline" 
              size="sm"
              className="relative"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
              {!showPlugin && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Task Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {taskData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-accent/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{taskData.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Source:</span> {taskData.metadata.source}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {taskData.metadata.category}
                  </div>
                  <div>
                    <span className="font-medium">Language:</span> {taskData.metadata.language}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {taskData.metadata.submittedAt}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Quality Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Quality */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Overall Quality</Label>
                <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                  {[
                    { value: "excellent", label: "Excellent", color: "text-green-600" },
                    { value: "good", label: "Good", color: "text-blue-600" },
                    { value: "fair", label: "Fair", color: "text-yellow-600" },
                    { value: "poor", label: "Poor", color: "text-red-600" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className={`cursor-pointer ${option.color}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Quality Checks */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Quality Checks</Label>
                <div className="space-y-3">
                  {Object.entries(qualityChecks).map(([key, checked]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={checked}
                        onCheckedChange={(checked) => 
                          setQualityChecks(prev => ({ ...prev, [key]: checked as boolean }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm capitalize cursor-pointer">
                        {key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label htmlFor="comments" className="text-sm font-medium mb-2 block">
                  Comments (Optional)
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Add any additional notes about this content..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1" 
                  disabled={!selectedRating}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Rating
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tasks Completed:</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accuracy Rate:</span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Time/Task:</span>
                <span className="font-medium">3m 24s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaterPlatform;