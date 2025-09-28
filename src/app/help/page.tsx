import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/AuthGuard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, MessageCircle, Book, Video, Phone, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <AuthGuard requireAuth={true}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <h1 className="text-3xl font-bold tracking-tight">Get Help</h1>
                  <p className="text-muted-foreground">
                    Find answers and get support for your payment processing needs
                  </p>
                </div>
                
                {/* Help Search */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Help Center</CardTitle>
                      <CardDescription>
                        Find answers to your questions quickly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search for help..." className="pl-8" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Help Categories */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Book className="h-5 w-5" />
                        <span>Documentation</span>
                      </CardTitle>
                      <CardDescription>
                        Comprehensive guides and API documentation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Getting Started Guide
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        API Reference
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Integration Tutorials
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="h-5 w-5" />
                        <span>Video Tutorials</span>
                      </CardTitle>
                      <CardDescription>
                        Step-by-step video guides
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Payment Setup
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Stripe Integration
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Analytics Overview
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" />
                        <span>Community</span>
                      </CardTitle>
                      <CardDescription>
                        Connect with other users and developers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Community Forum
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Developer Discord
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        GitHub Discussions
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Section */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>
                        Quick answers to common questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">How do I integrate Stripe with my application?</h4>
                        <p className="text-sm text-muted-foreground">
                          You can integrate Stripe by following our step-by-step guide in the documentation section. We provide code examples for multiple programming languages.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">What payment methods are supported?</h4>
                        <p className="text-sm text-muted-foreground">
                          We support all major credit cards, digital wallets (Apple Pay, Google Pay), bank transfers, and are working on crypto payment support.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">How do I handle failed payments?</h4>
                        <p className="text-sm text-muted-foreground">
                          Failed payments are automatically retried according to your configured retry policy. You can also manually retry or refund payments from the dashboard.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Is there a mobile app available?</h4>
                        <p className="text-sm text-muted-foreground">
                          Currently, we provide a web-based dashboard that is fully responsive and works great on mobile devices. A native mobile app is in development.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Support */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>
                        Get in touch with our support team
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center space-y-2">
                          <Mail className="h-8 w-8 mx-auto text-muted-foreground" />
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-muted-foreground">support@zypto.com</p>
                          <Button variant="outline" size="sm">Send Email</Button>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <Phone className="h-8 w-8 mx-auto text-muted-foreground" />
                          <h4 className="font-medium">Phone Support</h4>
                          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                          <Button variant="outline" size="sm">Call Now</Button>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground" />
                          <h4 className="font-medium">Live Chat</h4>
                          <p className="text-sm text-muted-foreground">Available 24/7</p>
                          <Button variant="outline" size="sm">Start Chat</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
