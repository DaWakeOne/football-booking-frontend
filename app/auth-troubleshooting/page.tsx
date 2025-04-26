import { SupabaseDiagnostics } from "@/components/supabase-diagnostics"
import { SimplifiedAuthForm } from "@/components/simplified-auth-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthTroubleshootingPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Troubleshooting</h1>

      <div className="mb-8">
        <SupabaseDiagnostics />
      </div>

      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Try Simplified Authentication</AlertTitle>
        <AlertDescription>
          Since your diagnostics are passing but you're still having issues, try our simplified authentication method
          below. This uses standard Supabase auth methods with additional error handling.
        </AlertDescription>
      </Alert>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Simplified Authentication</CardTitle>
            <CardDescription>
              Use this alternative authentication method that works with standard Supabase auth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-4">
                <Tabs defaultValue="player">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="player">Player</TabsTrigger>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                  </TabsList>
                  <TabsContent value="player" className="mt-4">
                    <SimplifiedAuthForm mode="login" role="player" />
                  </TabsContent>
                  <TabsContent value="owner" className="mt-4">
                    <SimplifiedAuthForm mode="login" role="owner" />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <Tabs defaultValue="player">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="player">Player</TabsTrigger>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                  </TabsList>
                  <TabsContent value="player" className="mt-4">
                    <SimplifiedAuthForm mode="signup" role="player" />
                  </TabsContent>
                  <TabsContent value="owner" className="mt-4">
                    <SimplifiedAuthForm mode="signup" role="owner" />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Alert className="mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Still having issues?</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Check the authentication debug page to see detailed information about your current authentication state:
          </p>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/auth-debug">Go to Authentication Debug Page</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
