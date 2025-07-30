"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Interfaces
export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  category: string
  title: string
  description: string
  uploadDate: string
}

export interface Report {
  id: string
  title: string
  date: string
  author: string
  status: "approved" | "pending" | "revision"
  type: "weekly" | "monthly" | "milestone"
  size: string
  fileName: string
  fileId: string
  description: string
}

export interface Invoice {
  id: string
  number: string
  vendor: string
  amount: number
  date: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  category: string
  fileName: string
  fileId: string
  description: string
}

export interface ServiceProvider {
  id: string
  name: string
  company: string
  category: string
  email: string
  phone: string
  location: string
  rating: number
  status: "active" | "inactive"
  description: string
  avatar?: string
  addedDate: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  avatar?: string
  bio: string
  joinDate: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    reports: boolean
    invoices: boolean
  }
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
    dateFormat: string
  }
}

export interface DashboardStats {
  totalReports: number
  pendingInvoices: string
  activeProjects: number
  teamMembers: number
  reportsChange: string
  invoicesChange: string
  projectsChange: string
  membersChange: string
}

interface DataContextType {
  // State
  reports: Report[]
  invoices: Invoice[]
  serviceProviders: ServiceProvider[]
  uploadedFiles: UploadedFile[]
  dashboardStats: DashboardStats
  userProfile: UserProfile | null
  
  // Actions
  addUploadedFile: (file: UploadedFile) => void
  addReport: (report: Omit<Report, 'id'>) => void
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void
  addServiceProvider: (provider: Omit<ServiceProvider, 'id'>) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  updateServiceProvider: (id: string, updates: Partial<ServiceProvider>) => void
  deleteFile: (id: string) => void
  processUploadedFile: (file: UploadedFile) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  createUserProfile: (email: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Initial data
const initialReports: Report[] = [
  {
    id: "1",
    title: "Weekly Progress Report #24",
    date: "2024-01-15",
    author: "System",
    status: "approved",
    type: "weekly", 
    size: "2.4 MB",
    fileName: "weekly-report-24.pdf",
    fileId: "file-1",
    description: "Weekly progress update for project milestones"
  }
]

const initialInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2024-001",
    vendor: "TechCorp Solutions", 
    amount: 5250.0,
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "pending",
    category: "Software",
    fileName: "invoice-techcorp-001.pdf",
    fileId: "file-2",
    description: "Software licensing and development services"
  }
]

const initialServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "John Construction",
    company: "BuildRight LLC",
    category: "Construction",
    email: "john@buildright.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    rating: 4.8,
    status: "active",
    description: "Specialized in commercial construction and renovation projects.",
    addedDate: "2024-01-01"
  }
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(initialServiceProviders)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Calculate dashboard stats dynamically
  const dashboardStats: DashboardStats = {
    totalReports: reports.length,
    pendingInvoices: `$${invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0)
      .toLocaleString()}`,
    activeProjects: Math.ceil(reports.length / 3), // Approximate active projects
    teamMembers: serviceProviders.filter(p => p.status === 'active').length,
    reportsChange: `+${Math.max(0, reports.length - 3)}`,
    invoicesChange: `+${Math.max(0, invoices.filter(i => i.status === 'pending').length - 1)}`,
    projectsChange: `+${Math.max(0, Math.ceil(reports.length / 3) - 2)}`,
    membersChange: `${serviceProviders.filter(p => p.status === 'active').length - 1}`
  }

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('dashboard-reports')
    const savedInvoices = localStorage.getItem('dashboard-invoices')
    const savedProviders = localStorage.getItem('dashboard-providers')
    const savedFiles = localStorage.getItem('dashboard-files')
    const savedProfile = localStorage.getItem('user-profile')

    if (savedReports) setReports(JSON.parse(savedReports))
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices))
    if (savedProviders) setServiceProviders(JSON.parse(savedProviders))
    if (savedFiles) setUploadedFiles(JSON.parse(savedFiles))
    if (savedProfile) setUserProfile(JSON.parse(savedProfile))
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('dashboard-reports', JSON.stringify(reports))
  }, [reports])

  useEffect(() => {
    localStorage.setItem('dashboard-invoices', JSON.stringify(invoices))
  }, [invoices])

  useEffect(() => {
    localStorage.setItem('dashboard-providers', JSON.stringify(serviceProviders))
  }, [serviceProviders])

  useEffect(() => {
    localStorage.setItem('dashboard-files', JSON.stringify(uploadedFiles))
  }, [uploadedFiles])

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('user-profile', JSON.stringify(userProfile))
    }
  }, [userProfile])

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file])
    processUploadedFile(file)
  }

  const processUploadedFile = (file: UploadedFile) => {
    const now = new Date()
    const userEmail = localStorage.getItem('userEmail') || 'Unknown User'

    switch (file.category) {
      case 'report':
        const newReport: Report = {
          id: `report-${Date.now()}`,
          title: file.title,
          date: file.uploadDate,
          author: userEmail,
          status: "pending",
          type: file.title.toLowerCase().includes('weekly') ? 'weekly' : 
                file.title.toLowerCase().includes('monthly') ? 'monthly' : 'milestone',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileName: file.name,
          fileId: file.id,
          description: file.description
        }
        setReports(prev => [newReport, ...prev])
        break

      case 'invoice':
        // Extract amount from title or use default
        const amountMatch = file.title.match(/\$?([\d,]+(?:\.\d{2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 1000;
        
        const newInvoice: Invoice = {
          id: `invoice-${Date.now()}`,
          number: `INV-${now.getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
          vendor: file.title.includes(' - ') ? file.title.split(' - ')[1] : 'New Vendor',
          amount: amount,
          date: file.uploadDate,
          dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "pending",
          category: file.description.toLowerCase().includes('software') ? 'Software' :
                   file.description.toLowerCase().includes('material') ? 'Materials' :
                   file.description.toLowerCase().includes('service') ? 'Services' : 'Other',
          fileName: file.name,
          fileId: file.id,
          description: file.description
        }
        setInvoices(prev => [newInvoice, ...prev])
        break

      default:
        // For other file types, we could create general documents or handle differently
        break
    }
  }

  const addReport = (report: Omit<Report, 'id'>) => {
    const newReport = { ...report, id: `report-${Date.now()}` }
    setReports(prev => [newReport, ...prev])
  }

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...invoice, id: `invoice-${Date.now()}` }
    setInvoices(prev => [newInvoice, ...prev])
  }

  const addServiceProvider = (provider: Omit<ServiceProvider, 'id'>) => {
    const newProvider = { ...provider, id: `provider-${Date.now()}`, addedDate: new Date().toISOString().split('T')[0] }
    setServiceProviders(prev => [newProvider, ...prev])
  }

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ))
  }

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ))
  }

  const updateServiceProvider = (id: string, updates: Partial<ServiceProvider>) => {
    setServiceProviders(prev => prev.map(provider => 
      provider.id === id ? { ...provider, ...updates } : provider
    ))
  }

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
    // Also remove related reports/invoices if needed
    setReports(prev => prev.filter(report => report.fileId !== id))
    setInvoices(prev => prev.filter(invoice => invoice.fileId !== id))
  }

  const createUserProfile = (email: string) => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      firstName: "",
      lastName: "",
      email: email,
      phone: "",
      role: "Team Member",
      department: "",
      bio: "",
      joinDate: new Date().toISOString().split('T')[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        push: true,
        reports: true,
        invoices: true
      },
      preferences: {
        theme: "system",
        language: "en",
        dateFormat: "MM/DD/YYYY"
      }
    }
    setUserProfile(newProfile)
    return newProfile
  }

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const value: DataContextType = {
    reports,
    invoices,
    serviceProviders,
    uploadedFiles,
    dashboardStats,
    userProfile,
    addUploadedFile,
    addReport,
    addInvoice,
    addServiceProvider,
    updateReport,
    updateInvoice,
    updateServiceProvider,
    deleteFile,
    processUploadedFile,
    createUserProfile,
    updateUserProfile
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}