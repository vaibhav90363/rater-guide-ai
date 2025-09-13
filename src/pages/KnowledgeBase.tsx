import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Search,
  FileText,
  Image,
  Download,
  Eye,
  Tag,
  Calendar,
  MoreVertical,
  BookOpen,
  Zap,
  CheckCircle,
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

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const documents = [
    {
      id: "KB001",
      name: "Safety Policy Guidelines v2.1",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
      uploadedBy: "Sarah Admin",
      status: "indexed",
      chunks: 156,
      embeddings: 156,
      tags: ["safety", "moderation", "policy"],
      bookmarks: 23,
      version: "2.1",
    },
    {
      id: "KB002", 
      name: "Content Classification Framework",
      type: "HTML",
      size: "890 KB",
      uploadedAt: "2024-02-01",
      uploadedBy: "Mike Admin",
      status: "processing",
      chunks: 89,
      embeddings: 67,
      tags: ["classification", "framework"],
      bookmarks: 12,
      version: "1.0",
    },
    {
      id: "KB003",
      name: "Visual Content Standards",
      type: "PDF", 
      size: "5.1 MB",
      uploadedAt: "2024-01-28",
      uploadedBy: "Lisa Admin",
      status: "indexed",
      chunks: 203,
      embeddings: 203,
      tags: ["visual", "standards", "images"],
      bookmarks: 45,
      version: "3.2",
    },
    {
      id: "KB004",
      name: "Training Examples Collection",
      type: "Images",
      size: "12.3 MB", 
      uploadedAt: "2024-02-05",
      uploadedBy: "Alex Admin",
      status: "indexed",
      chunks: 78,
      embeddings: 78,
      tags: ["training", "examples"],
      bookmarks: 8,
      version: "1.5",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "indexed":
        return "bg-success/10 text-success border-success/20";
      case "processing":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "html":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "images":
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || doc.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Manage guideline documents and training materials with AI-powered indexing
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <BookOpen className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="bg-success/10 text-success">
                +3 this week
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              All indexed and searchable
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Zap className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                526 total
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Indexed Chunks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">504</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for AI retrieval
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Tag className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="bg-accent/50 text-accent-foreground">
                88 uses
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bookmarked Snippets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">88</div>
            <p className="text-xs text-muted-foreground mt-1">
              Frequently referenced
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-success" />
              <Badge variant="secondary" className="bg-success/10 text-success">
                96.2% uptime
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Search Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1.2s</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg retrieval time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents and tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="images">Images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/50">
                    {getFileIcon(document.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{document.name}</h3>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        v{document.version}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{document.type} • {document.size}</span>
                      <span>Uploaded {document.uploadedAt} by {document.uploadedBy}</span>
                      <span>{document.bookmarks} bookmarks</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Processing Progress */}
                    {document.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Indexing Progress</span>
                          <span>{document.embeddings}/{document.chunks} chunks</span>
                        </div>
                        <Progress 
                          value={(document.embeddings / document.chunks) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Indexed Status */}
                    {document.status === "indexed" && (
                      <div className="flex items-center gap-2 text-sm text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span>{document.chunks} chunks indexed and searchable</span>
                      </div>
                    )}
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
                      Preview Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download Original
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="w-4 h-4 mr-2" />
                      Manage Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Version
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Upload your first guideline document to get started"
            }
          </p>
          {!searchTerm && typeFilter === "all" && (
            <Button className="bg-gradient-primary hover:opacity-90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;