"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Receipt, Users, Activity, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic" // Import dynamic
import FileUpload from "@/components/file-upload"
import ReportsSection from "@/components/reports-section"
import InvoicesSection from "@/components/invoices-section"
import { ThemeToggle } from "@/components/theme-toggle"
import ServiceProviders from "@/components/service-providers" // Import ServiceProviders component

// Dynamically import ThreeBackground with SSR disabled
const ThreeBackground = dynamic(() => import("@/components/three-background"), { ssr: false })

export default function Dashboard() {
  const [userType, setUserType] = useState<"shareholder" | "team">("shareholder")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") as "shareholder" | "team"
    const storedEmail = localStorage.getItem("userEmail")

    if (!storedUserType || !storedEmail) {
      router.push("/")
      return
    }

    setUserType(storedUserType)
    setUserEmail(storedEmail)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const stats = [
    { title: "Total Reports", value: "24", change: "+12%", icon: FileText },
    { title: "Pending Invoices", value: "$12,450", change: "+8%", icon: Receipt },
    { title: "Active Projects", value: "8", change: "+2", icon: Activity },
    { title: "Team Members", value: "3", change: "0", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 relative overflow-hidden">
      <ThreeBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Project Portal</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {userEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={userType === "shareholder" ? "default" : "secondary"}>
                  {userType === "shareholder" ? "Shareholder" : "Team Member"}
                </Badge>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur-sm border-border/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="providers">Service Providers</TabsTrigger>
              {userType === "team" && <TabsTrigger value="upload">Upload Files</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Project Progress</CardTitle>
                    <CardDescription className="text-muted-foreground">Overall completion status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-foreground">
                        <span>Phase 1: Planning</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-foreground">
                        <span>Phase 2: Development</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-foreground">
                        <span>Phase 3: Testing</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-foreground">
                        <span>Phase 4: Deployment</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">Latest updates and submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Weekly Report #24 uploaded</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Invoice #INV-2024-001 submitted</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">New service provider added</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <ReportsSection userType={userType} />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesSection userType={userType} />
            </TabsContent>

            <TabsContent value="providers">
              <ServiceProviders userType={userType} />
            </TabsContent>

            {userType === "team" && (
              <TabsContent value="upload">
                <FileUpload />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
