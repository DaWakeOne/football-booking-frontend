"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

export function EnvInjector() {
  const [supabaseUrl, setSupabaseUrl] = useState<string | undefined>(undefined)
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string | undefined>(undefined)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // Create a global __ENV__ object to store environment variables
    // This helps with "Open in new tab" scenarios
    if (typeof window !== "undefined") {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setSupabaseUrl(url)
      setSupabaseAnonKey(key)
      ;(window as any).__ENV__ = {
        NEXT_PUBLIC_SUPABASE_URL: url,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
      }
    }
  }, [])

  const handleUpdateEnv = () => {
    try {
      if (typeof window !== "undefined") {
        ;(window as any).__ENV__ = {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
        }
        setIsSuccess(true)
        setIsError(false)
      }
    } catch (error) {
      setIsError(true)
      setIsSuccess(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert className={isSuccess ? "bg-green-500 text-white" : isError ? "bg-red-500 text-white" : "hidden"}>
        {isSuccess && <CheckCircle className="h-4 w-4" />}
        {isError && <XCircle className="h-4 w-4" />}
        <AlertTitle>{isSuccess ? "Success!" : "Error!"}</AlertTitle>
        <AlertDescription>
          {isSuccess ? "Environment variables updated successfully." : "Failed to update environment variables."}
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="supabaseUrl">Supabase URL</Label>
        <Input type="text" id="supabaseUrl" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
        <Input
          type="text"
          id="supabaseAnonKey"
          value={supabaseAnonKey}
          onChange={(e) => setSupabaseAnonKey(e.target.value)}
        />
      </div>
      <Button onClick={handleUpdateEnv}>Update Environment Variables</Button>
    </div>
  )
}
