import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { SupabaseService } from '../services/supabaseService'
import { 
  CheckCircle, 
  XCircle, 
  Database, 
  Users, 
  FolderOpen, 
  FileText, 
  Star,
  Shield,
  BookOpen,
  BarChart3,
  MessageSquare
} from 'lucide-react'

interface TestResult {
  name: string
  success: boolean
  message: string
  data?: any
}

export const DatabaseTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState('connection')

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    try {
      const result = await testFunction()
      setTestResults(prev => [...prev, {
        name: testName,
        success: true,
        message: 'Success',
        data: result
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: testName,
        success: false,
        message: `Error: ${error}`
      }])
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])

    // Connection Test
    await runTest('Database Connection', async () => {
      return await SupabaseService.testConnection()
    })

    // Organizations
    await runTest('Get Organizations', async () => {
      return await SupabaseService.getOrganizations()
    })

    // Users
    await runTest('Get Users', async () => {
      return await SupabaseService.getUsers()
    })

    await runTest('Get Raters', async () => {
      return await SupabaseService.getRaters()
    })

    // Projects
    await runTest('Get Projects', async () => {
      return await SupabaseService.getProjects()
    })

    // Tasks
    await runTest('Get Tasks', async () => {
      return await SupabaseService.getTasks()
    })

    // Ratings
    await runTest('Get Ratings', async () => {
      return await SupabaseService.getRatings()
    })

    // QC Reviews
    await runTest('Get QC Reviews', async () => {
      return await SupabaseService.getQCReviews()
    })

    // Knowledge Base
    await runTest('Get Knowledge Base Documents', async () => {
      return await SupabaseService.getKnowledgeBaseDocuments()
    })

    // Performance
    await runTest('Get Rater Performance', async () => {
      return await SupabaseService.getRaterPerformance()
    })

    // Chat Messages
    await runTest('Get Chat Messages', async () => {
      return await SupabaseService.getChatMessages('test-session-id')
    })

    setIsLoading(false)
  }

  const runConnectionTest = async () => {
    setIsLoading(true)
    setTestResults([])
    await runTest('Database Connection', async () => {
      return await SupabaseService.testConnection()
    })
    setIsLoading(false)
  }

  const runCRUDTests = async () => {
    setIsLoading(true)
    setTestResults([])

    try {
      // Test creating a new organization
      await runTest('Create Organization', async () => {
        return await SupabaseService.createOrganization({
          name: 'Test Organization',
          domain: 'test.com',
          settings: { test: true }
        })
      })

      // Test creating a new user
      await runTest('Create User', async () => {
        const orgs = await SupabaseService.getOrganizations()
        if (orgs.length === 0) throw new Error('No organizations found')
        
        return await SupabaseService.createUser({
          organization_id: orgs[0].id,
          email: 'test@example.com',
          name: 'Test User',
          role: 'rater',
          status: 'active',
          preferences: {},
          metadata: {}
        })
      })

      // Test creating a new project
      await runTest('Create Project', async () => {
        const orgs = await SupabaseService.getOrganizations()
        const users = await SupabaseService.getUsers()
        
        if (orgs.length === 0 || users.length === 0) {
          throw new Error('No organizations or users found')
        }
        
        return await SupabaseService.createProject({
          organization_id: orgs[0].id,
          name: 'Test Project',
          description: 'A test project for database testing',
          type: 'rater',
          status: 'active',
          settings: { test: true },
          created_by: users[0].id
        })
      })

    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'CRUD Tests',
        success: false,
        message: `CRUD test failed: ${error}`
      }])
    }

    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getSuccessCount = () => testResults.filter(r => r.success).length
  const getTotalCount = () => testResults.length

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Operations Test Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing of all database operations and relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runConnectionTest}
              disabled={isLoading}
              variant="outline"
            >
              Test Connection
            </Button>
            <Button 
              onClick={runAllTests}
              disabled={isLoading}
              className="bg-primary"
            >
              {isLoading ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              onClick={runCRUDTests}
              disabled={isLoading}
              variant="outline"
            >
              Test CRUD Operations
            </Button>
            <Button 
              onClick={clearResults}
              disabled={isLoading}
              variant="ghost"
            >
              Clear Results
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getSuccessCount() === getTotalCount() ? 'default' : 'destructive'}>
                  {getSuccessCount()}/{getTotalCount()} Tests Passed
                </Badge>
                {getSuccessCount() === getTotalCount() && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    All Tests Successful! 🎉
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="connection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Connection Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.filter(r => r.name === 'Database Connection').map((result, index) => (
                    <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                      <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <AlertDescription>
                          <strong>{result.name}:</strong> {result.message}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Organization Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.filter(r => r.name.includes('Organization')).map((result, index) => (
                    <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                      <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <AlertDescription>
                          <strong>{result.name}:</strong> {result.message}
                          {result.data && Array.isArray(result.data) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Found {result.data.length} organizations
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    User Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.filter(r => r.name.includes('User') || r.name.includes('Rater')).map((result, index) => (
                    <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                      <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <AlertDescription>
                          <strong>{result.name}:</strong> {result.message}
                          {result.data && Array.isArray(result.data) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Found {result.data.length} users
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Project Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.filter(r => r.name.includes('Project')).map((result, index) => (
                    <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                      <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <AlertDescription>
                          <strong>{result.name}:</strong> {result.message}
                          {result.data && Array.isArray(result.data) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Found {result.data.length} projects
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Tasks & Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.filter(r => r.name.includes('Task') || r.name.includes('Rating')).map((result, index) => (
                      <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                        <div className="flex items-center gap-2">
                          {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <AlertDescription>
                            <strong>{result.name}:</strong> {result.message}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      QC Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.filter(r => r.name.includes('QC')).map((result, index) => (
                      <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                        <div className="flex items-center gap-2">
                          {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <AlertDescription>
                            <strong>{result.name}:</strong> {result.message}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Knowledge Base
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.filter(r => r.name.includes('Knowledge')).map((result, index) => (
                      <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                        <div className="flex items-center gap-2">
                          {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <AlertDescription>
                            <strong>{result.name}:</strong> {result.message}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Chat Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.filter(r => r.name.includes('Chat')).map((result, index) => (
                      <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                        <div className="flex items-center gap-2">
                          {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <AlertDescription>
                            <strong>{result.name}:</strong> {result.message}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Performance & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.filter(r => r.name.includes('Performance')).map((result, index) => (
                    <Alert key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                      <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <AlertDescription>
                          <strong>{result.name}:</strong> {result.message}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
