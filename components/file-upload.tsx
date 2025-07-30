"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useData, UploadedFile } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Receipt, X, FileText, Building2, Calendar } from "lucide-react"
import { useDropzone } from "react-dropzone"

type ContentType = "report" | "invoice" | "service-provider" | ""

interface ReportData {
  title: string
  type: "weekly" | "monthly" | "milestone"
  author: string
  status: "approved" | "pending" | "revision"
  description: string
}

interface InvoiceData {
  number: string
  vendor: string
  amount: number
  dueDate: string
  status: "paid" | "pending" | "overdue"
  category: string
  description: string
}

interface ServiceProviderData {
  name: string
  company: string
  category: string
  email: string
  phone: string
  location: string
  description: string
}

export default function FileUpload() {
  const { addUploadedFile, addReport, addInvoice, addServiceProvider } = useData()
  const [files, setFiles] = useState<File[]>([])
  const [contentType, setContentType] = useState<ContentType>("")
  
  // Form data for each content type
  const [reportData, setReportData] = useState<ReportData>({
    title: "",
    type: "weekly",
    author: "",
    status: "pending",
    description: ""
  })
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    number: "",
    vendor: "",
    amount: 0,
    dueDate: "",
    status: "pending",
    category: "",
    description: ""
  })
  
  const [serviceProviderData, setServiceProviderData] = useState<ServiceProviderData>({
    name: "",
    company: "",
    category: "",
    email: "",
    phone: "",
    location: "",
    description: ""
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
    },
    [],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type === "application/pdf") return <Receipt className="w-4 h-4" />
    return <ImageIcon className="w-4 h-4" />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const currentDate = new Date().toISOString().split('T')[0]
    const userEmail = localStorage.getItem('userEmail') || 'Unknown User'
    
    switch (contentType) {
      case 'report':
        files.forEach((file, index) => {
          addReport({
            title: reportData.title || file.name.split('.')[0],
            date: currentDate,
            author: reportData.author || userEmail,
            status: reportData.status,
            type: reportData.type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            fileName: file.name,
            fileId: `file-${Date.now()}-${index}`,
            description: reportData.description
          })
        })
        break
        
      case 'invoice':
        files.forEach((file, index) => {
          addInvoice({
            number: invoiceData.number || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            vendor: invoiceData.vendor,
            amount: invoiceData.amount,
            date: currentDate,
            dueDate: invoiceData.dueDate,
            status: invoiceData.status,
            category: invoiceData.category,
            fileName: file.name,
            fileId: `file-${Date.now()}-${index}`,
            description: invoiceData.description
          })
        })
        break
        
      case 'service-provider':
        addServiceProvider({
          name: serviceProviderData.name,
          company: serviceProviderData.company,
          category: serviceProviderData.category,
          email: serviceProviderData.email,
          phone: serviceProviderData.phone,
          location: serviceProviderData.location,
          rating: 0,
          status: "active",
          description: serviceProviderData.description,
        })
        break
    }

    // Reset form
    setFiles([])
    setContentType("")
    setReportData({
      title: "",
      type: "weekly",
      author: "",
      status: "pending",
      description: ""
    })
    setInvoiceData({
      number: "",
      vendor: "",
      amount: 0,
      dueDate: "",
      status: "pending",
      category: "",
      description: ""
    })
    setServiceProviderData({
      name: "",
      company: "",
      category: "",
      email: "",
      phone: "",
      location: "",
      description: ""
    })

    alert(`${contentType === 'service-provider' ? 'Service provider' : files.length + ' file(s)'} added successfully! Check the ${contentType === 'service-provider' ? 'Service Providers' : contentType === 'report' ? 'Reports' : 'Invoices'} tab.`)
  }

  const renderDynamicForm = () => {
    switch (contentType) {
      case 'report':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title *</Label>
                <Input
                  id="report-title"
                  placeholder="e.g., Weekly Progress Report #25"
                  value={reportData.title}
                  onChange={(e) => setReportData({...reportData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type *</Label>
                <Select value={reportData.type} onValueChange={(value: "weekly" | "monthly" | "milestone") => setReportData({...reportData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="milestone">Milestone Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-author">Author</Label>
                <Input
                  id="report-author"
                  placeholder="Report author name"
                  value={reportData.author}
                  onChange={(e) => setReportData({...reportData, author: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-status">Status</Label>
                <Select value={reportData.status} onValueChange={(value: "approved" | "pending" | "revision") => setReportData({...reportData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="revision">Needs Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Report Description</Label>
              <Textarea
                id="report-description"
                placeholder="Describe the report content and key findings"
                value={reportData.description}
                onChange={(e) => setReportData({...reportData, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        )

      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  placeholder="e.g., INV-2024-001 (auto-generated if empty)"
                  value={invoiceData.number}
                  onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-vendor">Vendor/Company *</Label>
                <Input
                  id="invoice-vendor"
                  placeholder="e.g., ABC Construction Co."
                  value={invoiceData.vendor}
                  onChange={(e) => setInvoiceData({...invoiceData, vendor: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-amount">Amount *</Label>
                <Input
                  id="invoice-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={invoiceData.amount || ''}
                  onChange={(e) => setInvoiceData({...invoiceData, amount: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-due-date">Due Date *</Label>
                <Input
                  id="invoice-due-date"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-status">Status</Label>
                <Select value={invoiceData.status} onValueChange={(value: "paid" | "pending" | "overdue") => setInvoiceData({...invoiceData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-category">Category *</Label>
                <Select value={invoiceData.category} onValueChange={(value) => setInvoiceData({...invoiceData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-description">Invoice Description</Label>
              <Textarea
                id="invoice-description"
                placeholder="Describe the services or products invoiced"
                value={invoiceData.description}
                onChange={(e) => setInvoiceData({...invoiceData, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        )

      case 'service-provider':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Contact Name *</Label>
                <Input
                  id="provider-name"
                  placeholder="e.g., John Smith"
                  value={serviceProviderData.name}
                  onChange={(e) => setServiceProviderData({...serviceProviderData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-company">Company *</Label>
                <Input
                  id="provider-company"
                  placeholder="e.g., ABC Construction LLC"
                  value={serviceProviderData.company}
                  onChange={(e) => setServiceProviderData({...serviceProviderData, company: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider-email">Email *</Label>
                <Input
                  id="provider-email"
                  type="email"
                  placeholder="contact@company.com"
                  value={serviceProviderData.email}
                  onChange={(e) => setServiceProviderData({...serviceProviderData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-phone">Phone *</Label>
                <Input
                  id="provider-phone"
                  placeholder="+1 (555) 123-4567"
                  value={serviceProviderData.phone}
                  onChange={(e) => setServiceProviderData({...serviceProviderData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider-category">Category *</Label>
                <Select value={serviceProviderData.category} onValueChange={(value) => setServiceProviderData({...serviceProviderData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="IT Services">IT Services</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-location">Location *</Label>
                <Input
                  id="provider-location"
                  placeholder="e.g., New York, NY"
                  value={serviceProviderData.location}
                  onChange={(e) => setServiceProviderData({...serviceProviderData, location: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-description">Description</Label>
              <Textarea
                id="provider-description"
                placeholder="Describe the services they provide"
                value={serviceProviderData.description}
                onChange={(e) => setServiceProviderData({...serviceProviderData, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Add Content</CardTitle>
          <CardDescription className="text-muted-foreground">
            Add reports, invoices, or service providers to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type *</Label>
              <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select what you want to add" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invoice">
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4" />
                      <span>Invoice</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="service-provider">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Service Provider</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Form Content */}
            {contentType && renderDynamicForm()}

            {/* File Upload Section - Only show for report and invoice types */}
            {(contentType === 'report' || contentType === 'invoice') && (
              <>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-border hover:border-border/80"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600 dark:text-blue-400">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-foreground mb-2">Drag & drop files here, or click to select files</p>
                      <p className="text-sm text-muted-foreground">
                        {contentType === 'report' ? 'Upload report documents (PDF, Word, Excel)' : 'Upload invoice files (PDF, Images)'}
                      </p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={
                !contentType || 
                (contentType === 'report' && (!reportData.title || files.length === 0)) ||
                (contentType === 'invoice' && (!invoiceData.vendor || !invoiceData.amount || !invoiceData.dueDate || !invoiceData.category || files.length === 0)) ||
                (contentType === 'service-provider' && (!serviceProviderData.name || !serviceProviderData.company || !serviceProviderData.email || !serviceProviderData.phone || !serviceProviderData.category || !serviceProviderData.location))
              }
            >
              {contentType === 'service-provider' ? 'Add Service Provider' : 
               contentType === 'report' ? 'Add Report' : 
               contentType === 'invoice' ? 'Add Invoice' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
