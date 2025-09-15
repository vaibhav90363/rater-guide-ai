import { SupabaseTest } from '../components/SupabaseTest'
import { DatabaseTest } from '../components/DatabaseTest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Your Rater Guide AI</h1>
          <p className="text-xl text-muted-foreground">Complete backend setup with comprehensive database architecture</p>
        </div>
        
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connection">Connection Test</TabsTrigger>
            <TabsTrigger value="database">Database Operations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <div className="flex justify-center">
              <SupabaseTest />
            </div>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <DatabaseTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
