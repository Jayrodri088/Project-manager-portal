"use client"

import { useEffect, useState } from "react"
import { DataProvider, useData } from "@/contexts/DataContext"
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
import ProfileManagement from "@/components/profile-management"

// Dynamically import ThreeBackground with SSR disabled
const ThreeBackground = dynamic(() => import("@/components/three-background"), { ssr: false })

function DashboardContent() {
  const [userEmail, setUserEmail] = useState("")
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { dashboardStats, userProfile, createUserProfile, reports, invoices, serviceProviders } = useData()

  useEffect(() => {
    setIsClient(true)
    const storedEmail = localStorage.getItem("userEmail")

    if (!storedEmail) {
      router.push("/")
      return
    }

    setUserEmail(storedEmail)
    
    // Create user profile if it doesn't exist
    if (!userProfile) {
      createUserProfile(storedEmail)
    }
  }, [router, userProfile, createUserProfile])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const stats = [
    { title: "Total Reports", value: dashboardStats.totalReports.toString(), change: dashboardStats.reportsChange, icon: FileText },
    { title: "Pending Invoices", value: dashboardStats.pendingInvoices, change: dashboardStats.invoicesChange, icon: Receipt },
    { title: "Active Projects", value: dashboardStats.activeProjects.toString(), change: dashboardStats.projectsChange, icon: Activity },
    { title: "Team Members", value: dashboardStats.teamMembers.toString(), change: dashboardStats.membersChange, icon: Users },
  ]

  const getDisplayName = () => {
    if (userProfile?.firstName || userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`.trim()
    }
    if (userProfile?.email) {
      return userProfile.email.split('@')[0]
    }
    return userEmail.split('@')[0]
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }


  // Generate recent activity from real data
  const getRecentActivity = () => {
    const activities = []
    
    // Add recent reports
    const recentReports = reports
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
    
    recentReports.forEach(report => {
      activities.push({
        id: `report-${report.id}`,
        type: 'report',
        title: `${report.title} ${report.status === 'approved' ? 'approved' : report.status === 'pending' ? 'submitted' : 'needs revision'}`,
        time: report.date,
        color: report.status === 'approved' ? 'bg-green-500' : report.status === 'pending' ? 'bg-blue-500' : 'bg-orange-500'
      })
    })

    // Add recent invoices
    const recentInvoices = invoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2)
    
    recentInvoices.forEach(invoice => {
      activities.push({
        id: `invoice-${invoice.id}`,
        type: 'invoice',
        title: `${invoice.number} ${invoice.status === 'paid' ? 'paid' : invoice.status === 'pending' ? 'submitted' : 'overdue'}`,
        time: invoice.date,
        color: invoice.status === 'paid' ? 'bg-green-500' : invoice.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
      })
    })

    // Add recent service providers
    const recentProviders = serviceProviders
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      .slice(0, 2)
    
    recentProviders.forEach(provider => {
      activities.push({
        id: `provider-${provider.id}`,
        type: 'provider',
        title: `${provider.name} from ${provider.company} added`,
        time: provider.addedDate,
        color: 'bg-purple-500'
      })
    })

    // Sort all activities by date and return top 6
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6)
  }

  const formatTimeAgo = (dateString: string) => {
    if (!isClient) return dateString
    
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    // Use consistent date format to avoid hydration issues
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-light dark:bg-navy relative overflow-hidden">
      <ThreeBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/90 dark:bg-navy/90 backdrop-blur-sm border-b border-teal/30 dark:border-teal/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal to-pink rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-navy dark:text-white">Project Portal</h1>
                  <p className="text-sm text-navy/70 dark:text-light/70">{getGreeting()}, {getDisplayName()}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-teal/50 text-navy hover:bg-teal/10 hover:border-teal dark:border-teal/30 dark:text-light dark:hover:bg-teal/20"
                >
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
                  className="bg-white/80 dark:bg-navy/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-navy/90 transition-all duration-300 border-teal/30 dark:border-teal/50 shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-navy/70 dark:text-light/70">{stat.title}</p>
                        <p className="text-2xl font-bold text-navy dark:text-white">{stat.value}</p>
                        <p className="text-xs text-teal dark:text-teal font-medium">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-teal to-pink rounded-lg flex items-center justify-center shadow-lg">
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
            <TabsList className="bg-white/80 dark:bg-navy/80 backdrop-blur-sm border-teal/30 dark:border-teal/50 shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Reports</TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Invoices</TabsTrigger>
              <TabsTrigger value="providers" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Service Providers</TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Add Content</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-teal/20 data-[state=active]:text-navy dark:data-[state=active]:text-white">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Activity - Only Real Data */}
              <Card className="bg-white/80 dark:bg-navy/80 backdrop-blur-sm border-teal/30 dark:border-teal/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-navy dark:text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-navy/70 dark:text-light/70">
                    Latest updates from your reports, invoices, and service providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecentActivity().length > 0 ? (
                      getRecentActivity().map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.time)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No activity yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add reports, invoices, or service providers to see activity here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Real Data Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Reports Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Reports</span>
                        <span className="font-medium">{reports.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Approved</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {reports.filter(r => r.status === 'approved').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                          {reports.filter(r => r.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Need Revision</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {reports.filter(r => r.status === 'revision').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Invoices Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Invoices</span>
                        <span className="font-medium">{invoices.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="font-medium">
                          ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending Amount</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                          ${invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overdue</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {invoices.filter(i => i.status === 'overdue').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Service Providers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Providers</span>
                        <span className="font-medium">{serviceProviders.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {serviceProviders.filter(p => p.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Categories</span>
                        <span className="font-medium">
                          {new Set(serviceProviders.map(p => p.category)).size}
                        </span>
                      </div>
                      {serviceProviders.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Most Common</span>
                          <span className="font-medium text-xs">
                            {Object.entries(
                              serviceProviders.reduce((acc, p) => {
                                acc[p.category] = (acc[p.category] || 0) + 1
                                return acc
                              }, {} as Record<string, number>)
                            ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <ReportsSection />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesSection />
            </TabsContent>

            <TabsContent value="providers">
              <ServiceProviders />
            </TabsContent>

            <TabsContent value="upload">
              <FileUpload />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}
