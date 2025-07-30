"use client"

import type React from "react"

import { useState } from "react"
import { DataProvider, useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { createUserProfile } = useData()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - in real app, this would authenticate with backend
    localStorage.setItem("userEmail", email)
    
    // Create user profile if it doesn't exist
    createUserProfile(email)
    
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-light dark:bg-gradient-to-br dark:from-navy dark:via-navy dark:to-teal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-navy/90 border-teal/30 dark:border-teal/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-teal to-pink rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy dark:text-white">Project Portal</CardTitle>
            <CardDescription className="text-navy/70 dark:text-light/70">Access your project management dashboard</CardDescription>
            <div className="flex justify-center mt-4">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white dark:bg-white/10 border-teal/50 dark:border-teal/30 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-light/50 focus:border-teal focus:ring-teal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-navy dark:text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white dark:bg-white/10 border-teal/50 dark:border-teal/30 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-light/50 focus:border-teal focus:ring-teal"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal to-pink hover:from-teal/90 hover:to-pink/90 text-white font-semibold shadow-lg transition-all duration-200"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <DataProvider>
      <LoginContent />
    </DataProvider>
  )
}
