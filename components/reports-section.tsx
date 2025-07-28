"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Calendar, Search } from "lucide-react"

interface Report {
  id: string
  title: string
  date: string
  author: string
  status: "approved" | "pending" | "revision"
  type: "weekly" | "monthly" | "milestone"
  size: string
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Weekly Progress Report #24",
    date: "2024-01-15",
    author: "John Smith",
    status: "approved",
    type: "weekly",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Monthly Summary - December 2023",
    date: "2024-01-01",
    author: "Sarah Johnson",
    status: "pending",
    type: "monthly",
    size: "5.1 MB",
  },
  {
    id: "3",
    title: "Milestone 2 Completion Report",
    date: "2023-12-28",
    author: "Mike Davis",
    status: "approved",
    type: "milestone",
    size: "8.7 MB",
  },
  {
    id: "4",
    title: "Weekly Progress Report #23",
    date: "2023-12-08",
    author: "John Smith",
    status: "revision",
    type: "weekly",
    size: "1.9 MB",
  },
]

interface ReportsSectionProps {
  userType: "shareholder" | "team"
}

export default function ReportsSection({ userType }: ReportsSectionProps) {
  const [reports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.type === filterType
    const matchesStatus = filterStatus === "all" || report.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30"
      case "revision":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
      case "monthly":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30"
      case "milestone":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Reports Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all project reports and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{report.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">by {report.author}</p>
                      <p className="text-sm text-muted-foreground">{report.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                  <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
