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
import { RefreshCw, Plus, Search, Filter, Download, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

export default function SubscriptionsPage() {
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                      <p className="text-muted-foreground">
                        Manage recurring billing and subscription plans
                      </p>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Plan
                    </Button>
                  </div>
                </div>
                
                {/* Subscription Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,247</div>
                      <p className="text-xs text-muted-foreground">
                        +45 this month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,450</div>
                      <p className="text-xs text-muted-foreground">
                        +8.2% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2.3%</div>
                      <p className="text-xs text-muted-foreground">
                        -0.5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. LTV</CardTitle>
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$89.50</div>
                      <p className="text-xs text-muted-foreground">
                        +$5.20 from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Management */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Plans</CardTitle>
                      <CardDescription>
                        Manage your subscription plans and pricing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search subscriptions..." className="pl-8" />
                        </div>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                      
                      {/* Subscription List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Premium Plan</h3>
                              <p className="text-sm text-muted-foreground">$29.99/month</p>
                              <p className="text-xs text-muted-foreground">1,247 active subscribers</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Basic Plan</h3>
                              <p className="text-sm text-muted-foreground">$9.99/month</p>
                              <p className="text-xs text-muted-foreground">856 active subscribers</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                              <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Enterprise Plan</h3>
                              <p className="text-sm text-muted-foreground">$199.99/month</p>
                              <p className="text-xs text-muted-foreground">45 active subscribers</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">Draft</Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
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
