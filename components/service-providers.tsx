"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Phone, Mail, MapPin, Plus, Search, Star } from "lucide-react"
import { gsap } from "gsap"

interface ServiceProvider {
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
}

const mockProviders: ServiceProvider[] = [
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
  },
  {
    id: "2",
    name: "Sarah Tech Solutions",
    company: "TechCorp Inc",
    category: "IT Services",
    email: "sarah@techcorp.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    rating: 4.9,
    status: "active",
    description: "Full-stack development and IT infrastructure management.",
  },
  {
    id: "3",
    name: "Mike Design Studio",
    company: "Creative Minds",
    category: "Design",
    email: "mike@creativeminds.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    rating: 4.7,
    status: "active",
    description: "UI/UX design and branding for digital products.",
  },
  {
    id: "4",
    name: "Legal Associates",
    company: "Law Firm Partners",
    category: "Legal",
    email: "contact@lawfirm.com",
    phone: "+1 (555) 321-0987",
    location: "Chicago, IL",
    rating: 4.6,
    status: "inactive",
    description: "Corporate law and contract management services.",
  },
]

interface ServiceProvidersProps {
  userType: "shareholder" | "team"
}

// Custom Avatar Component with Initials
const ProviderAvatar = ({ name, category }: { name: string; category: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const getGradientByCategory = (category: string) => {
    const gradients: { [key: string]: string } = {
      Construction: "bg-gradient-to-br from-orange-400 to-red-500",
      "IT Services": "bg-gradient-to-br from-blue-400 to-purple-500",
      Design: "bg-gradient-to-br from-purple-400 to-pink-500",
      Legal: "bg-gradient-to-br from-red-400 to-pink-500",
      Marketing: "bg-gradient-to-br from-green-400 to-blue-500",
      Finance: "bg-gradient-to-br from-yellow-400 to-orange-500",
    }
    return gradients[category] || "bg-gradient-to-br from-gray-400 to-gray-600"
  }

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getGradientByCategory(
        category,
      )} shadow-lg`}
    >
      {initials}
    </div>
  )
}

export default function ServiceProviders({ userType }: ServiceProvidersProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>(mockProviders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [newProvider, setNewProvider] = useState({
    name: "",
    company: "",
    category: "",
    email: "",
    phone: "",
    location: "",
    description: "",
  })

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || provider.category === filterCategory
    const matchesStatus = filterStatus === "all" || provider.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // GSAP Animation for cards
  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".provider-card")

      // Initial animation
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      )

      // Hover animations
      cards.forEach((card) => {
        const cardElement = card as HTMLElement

        cardElement.addEventListener("mouseenter", () => {
          gsap.to(cardElement, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          })
        })

        cardElement.addEventListener("mouseleave", () => {
          gsap.to(cardElement, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          })
        })
      })
    }
  }, [filteredProviders])

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault()
    const provider: ServiceProvider = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProvider,
      rating: 0,
      status: "active",
    }
    setProviders([...providers, provider])
    setNewProvider({
      name: "",
      company: "",
      category: "",
      email: "",
      phone: "",
      location: "",
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
      : "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Construction: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30",
      "IT Services": "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30",
      Design: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30",
      Legal: "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30",
      Marketing: "bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30",
      Finance: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30",
    }
    return colors[category] || "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30"
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-foreground">Service Providers</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your network of service providers and contractors
              </CardDescription>
            </div>
            {userType === "shareholder" && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Provider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Add New Service Provider</DialogTitle>
                    <DialogDescription>Add a new service provider to your network</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddProvider} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Contact Name</Label>
                        <Input
                          id="name"
                          value={newProvider.name}
                          onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newProvider.company}
                          onChange={(e) => setNewProvider({ ...newProvider, company: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProvider.category}
                        onValueChange={(value) => setNewProvider({ ...newProvider, category: value })}
                      >
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newProvider.email}
                          onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newProvider.phone}
                          onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newProvider.location}
                        onChange={(e) => setNewProvider({ ...newProvider, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProvider.description}
                        onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Provider
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="IT Services">IT Services</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Providers Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="provider-card bg-card border-border transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ProviderAvatar name={provider.name} category={provider.category} />
                      <div>
                        <h3 className="font-semibold text-foreground">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(provider.status)}>{provider.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Badge className={getCategoryColor(provider.category)}>{provider.category}</Badge>
                    {provider.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-foreground">{provider.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{provider.description}</p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{provider.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No service providers found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
