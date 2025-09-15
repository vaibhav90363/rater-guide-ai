import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  Copy, 
  Trash2,
  Move,
  Settings,
  Type,
  Square,
  Circle,
  Layout,
  Image,
  MessageSquare,
  Star,
  CheckCircle,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";

interface UIComponent {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const UIDesigner = ({ projectType }: { projectType: 'rater' | 'qc' }) => {
  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null);
  const [components, setComponents] = useState<UIComponent[]>([]);
  const [canvasSize, setCanvasSize] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('components');
  const [history, setHistory] = useState<UIComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentTemplates = [
    // Layout Components
    { type: 'card', name: 'Card', icon: Square, category: 'layout' },
    { type: 'container', name: 'Container', icon: Layout, category: 'layout' },
    { type: 'separator', name: 'Separator', icon: Minus, category: 'layout' },
    
    // Input Components
    { type: 'input', name: 'Text Input', icon: Type, category: 'input' },
    { type: 'textarea', name: 'Text Area', icon: Type, category: 'input' },
    { type: 'button', name: 'Button', icon: Square, category: 'input' },
    { type: 'select', name: 'Select', icon: Circle, category: 'input' },
    { type: 'switch', name: 'Switch', icon: Circle, category: 'input' },
    { type: 'slider', name: 'Slider', icon: Minus, category: 'input' },
    
    // Display Components
    { type: 'badge', name: 'Badge', icon: Circle, category: 'display' },
    { type: 'progress', name: 'Progress', icon: Minus, category: 'display' },
    { type: 'avatar', name: 'Avatar', icon: Circle, category: 'display' },
    
    // Plugin Specific Components
    ...(projectType === 'rater' ? [
      { type: 'rating-stars', name: 'Rating Stars', icon: Star, category: 'plugin' },
      { type: 'confidence-slider', name: 'Confidence Slider', icon: Slider, category: 'plugin' },
      { type: 'checklist', name: 'Checklist', icon: CheckCircle, category: 'plugin' },
      { type: 'ai-suggestion', name: 'AI Suggestion', icon: Bot, category: 'plugin' },
    ] : [
      { type: 'flag-indicator', name: 'Flag Indicator', icon: AlertTriangle, category: 'plugin' },
      { type: 'comparison-view', name: 'Comparison View', icon: Settings, category: 'plugin' },
      { type: 'evidence-panel', name: 'Evidence Panel', icon: ShieldCheck, category: 'plugin' },
      { type: 'analysis-summary', name: 'Analysis Summary', icon: MessageSquare, category: 'plugin' },
    ])
  ];

  const addComponent = (template: any) => {
    const newComponent: UIComponent = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      name: template.name,
      props: getDefaultProps(template.type),
      position: { x: 50, y: 50 },
      size: getDefaultSize(template.type)
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent);
    saveToHistory(newComponents);
  };

  const getDefaultProps = (type: string) => {
    const defaults: Record<string, any> = {
      'card': { title: 'Card Title', description: 'Card description' },
      'button': { text: 'Button', variant: 'default', size: 'default' },
      'input': { placeholder: 'Enter text...', type: 'text' },
      'textarea': { placeholder: 'Enter text...', rows: 3 },
      'badge': { text: 'Badge', variant: 'default' },
      'select': { placeholder: 'Select option...', options: ['Option 1', 'Option 2'] },
      'switch': { checked: false, label: 'Switch' },
      'slider': { min: 0, max: 100, value: 50 },
      'rating-stars': { maxRating: 5, currentRating: 0 },
      'confidence-slider': { min: 0, max: 100, value: 50, label: 'Confidence' },
      'checklist': { items: ['Item 1', 'Item 2'], checked: [false, false] },
      'flag-indicator': { severity: 'medium', text: 'Flagged' },
      'comparison-view': { title: 'Comparison' },
      'evidence-panel': { title: 'Evidence' },
      'analysis-summary': { title: 'Analysis Summary' }
    };
    return defaults[type] || {};
  };

  const getDefaultSize = (type: string) => {
    const sizes: Record<string, { width: number; height: number }> = {
      'card': { width: 300, height: 200 },
      'button': { width: 120, height: 40 },
      'input': { width: 200, height: 40 },
      'textarea': { width: 250, height: 80 },
      'badge': { width: 80, height: 24 },
      'select': { width: 200, height: 40 },
      'switch': { width: 60, height: 30 },
      'slider': { width: 200, height: 40 },
      'rating-stars': { width: 150, height: 30 },
      'confidence-slider': { width: 200, height: 60 },
      'checklist': { width: 250, height: 120 },
      'flag-indicator': { width: 120, height: 40 },
      'comparison-view': { width: 400, height: 300 },
      'evidence-panel': { width: 300, height: 200 },
      'analysis-summary': { width: 350, height: 150 }
    };
    return sizes[type] || { width: 100, height: 40 };
  };

  const updateComponent = (id: string, updates: Partial<UIComponent>) => {
    const newComponents = components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
    setSelectedComponent(updates as UIComponent);
    saveToHistory(newComponents);
  };

  const deleteComponent = (id: string) => {
    const newComponents = components.filter(comp => comp.id !== id);
    setComponents(newComponents);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
    saveToHistory(newComponents);
  };

  const saveToHistory = (newComponents: UIComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
    }
  };

  const renderComponent = (component: UIComponent) => {
    const { type, props } = component;
    
    switch (type) {
      case 'card':
        return (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="text-sm">{props.title}</CardTitle>
              <CardDescription className="text-xs">{props.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Card content goes here</p>
            </CardContent>
          </Card>
        );
      case 'button':
        return (
          <Button variant={props.variant} size={props.size}>
            {props.text}
          </Button>
        );
      case 'input':
        return (
          <Input 
            placeholder={props.placeholder} 
            type={props.type}
            className="w-full"
          />
        );
      case 'textarea':
        return (
          <Textarea 
            placeholder={props.placeholder} 
            rows={props.rows}
            className="w-full"
          />
        );
      case 'badge':
        return (
          <Badge variant={props.variant}>
            {props.text}
          </Badge>
        );
      case 'select':
        return (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch checked={props.checked} />
            <Label className="text-sm">{props.label}</Label>
          </div>
        );
      case 'slider':
        return (
          <div className="space-y-2">
            <Label className="text-sm">Slider</Label>
            <Slider 
              min={props.min} 
              max={props.max} 
              value={[props.value]} 
              className="w-full"
            />
          </div>
        );
      case 'rating-stars':
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: props.maxRating }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < props.currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
        );
      case 'confidence-slider':
        return (
          <div className="space-y-2">
            <Label className="text-sm">{props.label}</Label>
            <Slider 
              min={props.min} 
              max={props.max} 
              value={[props.value]} 
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">{props.value}%</div>
          </div>
        );
      case 'checklist':
        return (
          <div className="space-y-2">
            <Label className="text-sm">Checklist</Label>
            {props.items?.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border rounded border-gray-300" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        );
      case 'flag-indicator':
        return (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <Badge variant="outline" className="text-orange-600">
              {props.text}
            </Badge>
          </div>
        );
      case 'comparison-view':
        return (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="text-sm">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-red-50 rounded">Rater Rating</div>
                <div className="p-2 bg-green-50 rounded">AI Recommendation</div>
              </div>
            </CardContent>
          </Card>
        );
      case 'evidence-panel':
        return (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="text-sm">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">Evidence 1</div>
                <div className="p-2 bg-gray-50 rounded">Evidence 2</div>
              </div>
            </CardContent>
          </Card>
        );
      case 'analysis-summary':
        return (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="text-sm">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Analysis summary content</p>
            </CardContent>
          </Card>
        );
      default:
        return <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-xs">Unknown Component</div>;
    }
  };

  const groupedComponents = componentTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, any[]>);

  const presetTemplates = {
    'rater': [
      {
        name: 'Basic Rating Interface',
        description: 'Simple rating interface with stars and confidence slider',
        components: [
          { type: 'card', name: 'Rating Card', props: { title: 'Rate Content', description: 'Provide your rating below' }, position: { x: 50, y: 50 }, size: { width: 300, height: 200 } },
          { type: 'rating-stars', name: 'Rating Stars', props: { maxRating: 5, currentRating: 0 }, position: { x: 80, y: 120 }, size: { width: 150, height: 30 } },
          { type: 'confidence-slider', name: 'Confidence Slider', props: { min: 0, max: 100, value: 50, label: 'Confidence' }, position: { x: 80, y: 170 }, size: { width: 200, height: 60 } },
          { type: 'button', name: 'Submit Button', props: { text: 'Submit Rating', variant: 'default' }, position: { x: 200, y: 250 }, size: { width: 120, height: 40 } }
        ]
      },
      {
        name: 'Advanced Rating Interface',
        description: 'Complete rating interface with checklist and AI suggestions',
        components: [
          { type: 'card', name: 'Main Card', props: { title: 'Content Rating', description: 'Review and rate the content' }, position: { x: 50, y: 50 }, size: { width: 400, height: 300 } },
          { type: 'checklist', name: 'Review Checklist', props: { items: ['Content reviewed', 'Guidelines checked', 'Context analyzed'], checked: [false, false, false] }, position: { x: 70, y: 100 }, size: { width: 250, height: 120 } },
          { type: 'rating-stars', name: 'Rating Stars', props: { maxRating: 5, currentRating: 0 }, position: { x: 70, y: 240 }, size: { width: 150, height: 30 } },
          { type: 'ai-suggestion', name: 'AI Suggestion', props: { title: 'AI Suggestion' }, position: { x: 250, y: 100 }, size: { width: 150, height: 200 } }
        ]
      }
    ],
    'qc': [
      {
        name: 'Basic QC Review',
        description: 'Simple QC interface for reviewing flagged content',
        components: [
          { type: 'card', name: 'QC Card', props: { title: 'QC Review', description: 'Review the flagged content' }, position: { x: 50, y: 50 }, size: { width: 350, height: 250 } },
          { type: 'flag-indicator', name: 'Flag Indicator', props: { severity: 'medium', text: 'Flagged' }, position: { x: 70, y: 100 }, size: { width: 120, height: 40 } },
          { type: 'comparison-view', name: 'Comparison View', props: { title: 'Rater vs AI' }, position: { x: 70, y: 160 }, size: { width: 300, height: 80 } }
        ]
      },
      {
        name: 'Advanced QC Analysis',
        description: 'Complete QC interface with evidence panel and analysis',
        components: [
          { type: 'card', name: 'Main Card', props: { title: 'QC Analysis', description: 'Comprehensive review interface' }, position: { x: 50, y: 50 }, size: { width: 450, height: 350 } },
          { type: 'flag-indicator', name: 'Flag Indicator', props: { severity: 'high', text: 'High Priority' }, position: { x: 70, y: 100 }, size: { width: 120, height: 40 } },
          { type: 'comparison-view', name: 'Comparison View', props: { title: 'Rater vs AI Comparison' }, position: { x: 70, y: 160 }, size: { width: 350, height: 100 } },
          { type: 'evidence-panel', name: 'Evidence Panel', props: { title: 'Supporting Evidence' }, position: { x: 70, y: 280 }, size: { width: 200, height: 100 } },
          { type: 'analysis-summary', name: 'Analysis Summary', props: { title: 'Analysis Summary' }, position: { x: 290, y: 280 }, size: { width: 200, height: 100 } }
        ]
      }
    ]
  };

  const loadTemplate = (template: any) => {
    setComponents(template.components);
    setSelectedComponent(null);
    saveToHistory(template.components);
    setShowTemplates(false);
  };

  return (
    <div className="h-full flex">
      {/* Component Palette */}
      {!showPreview && (
        <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Component Palette</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Layout className="w-4 h-4 mr-1" />
              Templates
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag components to the canvas to build your {projectType} plugin interface
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {showTemplates ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Preset Templates</h4>
                {presetTemplates[projectType]?.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => loadTemplate(template)}>
                    <CardContent className="p-3">
                      <h5 className="text-sm font-medium">{template.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {template.components.length} components
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              Object.entries(groupedComponents).map(([category, templates]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.type}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addComponent(template)}
                    >
                      <template.icon className="w-4 h-4" />
                      <span className="text-xs">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))
            )}
          </div>
        </ScrollArea>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b bg-background flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={canvasSize === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCanvasSize('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={canvasSize === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCanvasSize('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setComponents([]);
                  setSelectedComponent(null);
                  saveToHistory([]);
                }}
                disabled={components.length === 0}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={showPreview ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div 
            ref={canvasRef}
            className={`mx-auto bg-white shadow-lg rounded-lg border-2 border-dashed border-gray-300 relative ${
              canvasSize === 'desktop' ? 'w-full max-w-4xl min-h-[600px]' : 'w-80 min-h-[600px]'
            }`}
          >
            {components.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Empty Canvas</h3>
                  <p className="text-sm text-muted-foreground">
                    Add components from the palette to start designing your {projectType} plugin interface
                  </p>
                </div>
              </div>
            ) : (
              components.map((component) => (
                <div
                  key={component.id}
                  className={`absolute border-2 ${
                    showPreview 
                      ? 'border-transparent' 
                      : selectedComponent?.id === component.id 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-gray-300'
                  } rounded ${showPreview ? '' : 'cursor-pointer'}`}
                  style={{
                    left: component.position.x,
                    top: component.position.y,
                    width: component.size.width,
                    height: component.size.height,
                  }}
                  onClick={() => !showPreview && setSelectedComponent(component)}
                >
                  <div className="w-full h-full p-2">
                    {renderComponent(component)}
                  </div>
                  
                  {!showPreview && selectedComponent?.id === component.id && (
                    <div className="absolute -top-8 left-0 flex items-center gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(component.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {!showPreview && (
        <div className="w-80 border-l bg-background">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Properties</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedComponent ? `Customize ${selectedComponent.name}` : 'Select a component to edit its properties'}
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {selectedComponent ? (
              <div className="space-y-4">
                {/* Position & Size */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Position & Size</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.x}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          position: { ...selectedComponent.position, x: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.y}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          position: { ...selectedComponent.position, y: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.width}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          size: { ...selectedComponent.size, width: parseInt(e.target.value) || 100 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Height</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.height}
                        onChange={(e) => updateComponent(selectedComponent.id, {
                          size: { ...selectedComponent.size, height: parseInt(e.target.value) || 40 }
                        })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Component-specific properties */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Properties</h4>
                  {Object.entries(selectedComponent.props).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      {typeof value === 'boolean' ? (
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: checked }
                          })}
                        />
                      ) : typeof value === 'number' ? (
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: parseInt(e.target.value) || 0 }
                          })}
                          className="h-8"
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            props: { ...selectedComponent.props, [key]: e.target.value }
                          })}
                          className="h-8"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a component to edit its properties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default UIDesigner;
