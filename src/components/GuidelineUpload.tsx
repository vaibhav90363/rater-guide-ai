import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  BookOpen,
  Download,
  Eye
} from "lucide-react";
import { SAMPLE_GUIDELINES } from "@/data/systemPrompts";

interface Guideline {
  id: string;
  title: string;
  content: string;
  version: string;
  uploadedAt: string;
  status: 'active' | 'draft' | 'archived';
}

interface GuidelineUploadProps {
  type: 'rater' | 'qc';
  onGuidelinesChange: (guidelines: string) => void;
}

const GuidelineUpload = ({ type, onGuidelinesChange }: GuidelineUploadProps) => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([
    {
      id: '1',
      title: SAMPLE_GUIDELINES[type].title,
      content: SAMPLE_GUIDELINES[type].content,
      version: '2.1',
      uploadedAt: '2024-01-15',
      status: 'active'
    }
  ]);
  
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    content: '',
    version: '1.0'
  });

  const [activeGuideline, setActiveGuideline] = useState<string>('1');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setNewGuideline({
          title: file.name.replace(/\.[^/.]+$/, ""),
          content,
          version: '1.0'
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSaveGuideline = () => {
    if (newGuideline.title && newGuideline.content) {
      const guideline: Guideline = {
        id: Date.now().toString(),
        title: newGuideline.title,
        content: newGuideline.content,
        version: newGuideline.version,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      };
      
      setGuidelines([...guidelines, guideline]);
      setNewGuideline({ title: '', content: '', version: '1.0' });
    }
  };

  const handleActivateGuideline = (id: string) => {
    setGuidelines(guidelines.map(g => ({
      ...g,
      status: g.id === id ? 'active' : g.status === 'active' ? 'archived' : g.status
    })));
    setActiveGuideline(id);
    
    const guideline = guidelines.find(g => g.id === id);
    if (guideline) {
      onGuidelinesChange(guideline.content);
    }
  };

  const activeGuidelineContent = guidelines.find(g => g.id === activeGuideline)?.content || '';

  // Initialize with active guideline
  React.useEffect(() => {
    if (activeGuidelineContent) {
      onGuidelinesChange(activeGuidelineContent);
    }
  }, [activeGuidelineContent, onGuidelinesChange]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Manage Guidelines</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="view">View Active</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {type === 'rater' ? 'Rater' : 'QC'} Guidelines
              </CardTitle>
              <CardDescription>
                Manage guidelines that power the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {guidelines.map((guideline) => (
                    <Card key={guideline.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{guideline.title}</h4>
                            <Badge variant={guideline.status === 'active' ? 'default' : 'secondary'}>
                              {guideline.status}
                            </Badge>
                            <Badge variant="outline">v{guideline.version}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {guideline.uploadedAt}
                          </p>
                          <p className="text-sm">
                            {guideline.content.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {guideline.status !== 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleActivateGuideline(guideline.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Guideline</CardTitle>
              <CardDescription>
                Add new guidelines or update existing ones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Guideline title"
                    value={newGuideline.title}
                    onChange={(e) => setNewGuideline({...newGuideline, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Version</label>
                  <Input
                    placeholder="1.0"
                    value={newGuideline.version}
                    onChange={(e) => setNewGuideline({...newGuideline, version: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".txt,.md,.doc,.docx"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Enter guideline content..."
                  value={newGuideline.content}
                  onChange={(e) => setNewGuideline({...newGuideline, content: e.target.value})}
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveGuideline} disabled={!newGuideline.title || !newGuideline.content}>
                  <FileText className="w-4 h-4 mr-2" />
                  Save Guideline
                </Button>
                <Button variant="outline" onClick={() => setNewGuideline({title: '', content: '', version: '1.0'})}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Guideline</CardTitle>
              <CardDescription>
                Currently active guideline being used by the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{activeGuidelineContent}</pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuidelineUpload;