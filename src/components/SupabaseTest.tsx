import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { SupabaseService } from '../services/supabaseService'

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus(null)
    
    try {
      const result = await SupabaseService.testConnection()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: `Error: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Test your Supabase connection to ensure everything is set up correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
        
        {connectionStatus && (
          <Alert className={connectionStatus.success ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>
              {connectionStatus.message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> Make sure to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Update your .env file with your Supabase URL and anon key</li>
            <li>Create your database tables in Supabase</li>
            <li>Set up Row Level Security (RLS) policies if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
