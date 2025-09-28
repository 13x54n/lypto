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
import { ShoppingCart, Plus, Search, Package, DollarSign, TrendingUp, Coins, Zap, Shield, Clock } from "lucide-react"

export default function ProductsPage() {
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
                      <h1 className="text-3xl font-bold tracking-tight">Solana Payment Products</h1>
                      <p className="text-muted-foreground">
                        Manage your Solana payment products and services
                      </p>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Solana Product
                    </Button>
                  </div>
                </div>
                
                {/* Solana Product Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Payment Products</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +5 new this month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">22</div>
                      <p className="text-xs text-muted-foreground">
                        92% integration rate
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Product</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">SOL Checkout</div>
                      <p className="text-xs text-muted-foreground">
                        1,247 integrations
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Fee</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +0.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Payment Products */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Products</CardTitle>
                      <CardDescription>
                        Manage your Solana payment products and integrations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search Solana products..." className="pl-8" />
                        </div>
                        <Button variant="outline">Filter</Button>
                        <Button variant="outline">Sort</Button>
                      </div>
                      
                      {/* Solana Product List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Coins className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">SOL Checkout Widget</h3>
                              <p className="text-sm text-muted-foreground">Embeddable Solana payment widget</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">0.5% fee</p>
                              <p className="text-sm text-muted-foreground">1,247 integrations</p>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Zap className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">Solana Payment API</h3>
                              <p className="text-sm text-muted-foreground">RESTful API for Solana payments</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">0.3% fee</p>
                              <p className="text-sm text-muted-foreground">892 integrations</p>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Shield className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">Solana Webhook Service</h3>
                              <p className="text-sm text-muted-foreground">Real-time payment notifications</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">Free</p>
                              <p className="text-sm text-muted-foreground">456 integrations</p>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Clock className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">Solana Recurring Payments</h3>
                              <p className="text-sm text-muted-foreground">Subscription management on Solana</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">0.7% fee</p>
                              <p className="text-sm text-muted-foreground">234 integrations</p>
                            </div>
                            <Badge variant="outline">Beta</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
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
