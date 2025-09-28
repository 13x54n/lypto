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
import { BarChart3, TrendingUp, Users, DollarSign, Activity, PieChart, Zap, Coins, Clock, Shield } from "lucide-react"

export default function AnalyticsPage() {
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
                  <h1 className="text-3xl font-bold tracking-tight">Solana Analytics</h1>
                  <p className="text-muted-foreground">
                    Solana network performance and crypto payment insights
                  </p>
                </div>
                
                {/* Solana Analytics Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">SOL Price</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$184.50</div>
                      <p className="text-xs text-muted-foreground">
                        +8.2% from last week
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Network TPS</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,847</div>
                      <p className="text-xs text-muted-foreground">
                        Transactions per second
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Fee</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.00025 SOL</div>
                      <p className="text-xs text-muted-foreground">
                        ~$0.05 USD per transaction
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Block Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">400ms</div>
                      <p className="text-xs text-muted-foreground">
                        Average block confirmation
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Analytics Charts and Insights */}
                <div className="grid gap-4 md:grid-cols-2 px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SOL Price Chart</CardTitle>
                      <CardDescription>
                        Solana price performance over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <div className="text-center">
                          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">SOL Price Chart Placeholder</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Volume</CardTitle>
                      <CardDescription>
                        Daily SOL transaction volume distribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Volume Chart Placeholder</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Network Performance Metrics */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Network Performance</CardTitle>
                      <CardDescription>
                        Key Solana network metrics and performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-medium">Network Uptime</span>
                          </div>
                          <div className="text-2xl font-bold">99.9%</div>
                          <Badge variant="secondary">Excellent</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Validator Count</span>
                          </div>
                          <div className="text-2xl font-bold">1,847</div>
                          <Badge variant="secondary">Decentralized</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">Finality Time</span>
                          </div>
                          <div className="text-2xl font-bold">400ms</div>
                          <Badge variant="secondary">Ultra Fast</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Ecosystem Metrics */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Ecosystem Health</CardTitle>
                      <CardDescription>
                        Solana ecosystem growth and adoption metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">Active Wallets</span>
                          </div>
                          <div className="text-2xl font-bold">2.1M</div>
                          <p className="text-xs text-muted-foreground">+15% this month</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4" />
                            <span className="text-sm font-medium">Daily Transactions</span>
                          </div>
                          <div className="text-2xl font-bold">45.2M</div>
                          <p className="text-xs text-muted-foreground">+8% this week</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm font-medium">TVL</span>
                          </div>
                          <div className="text-2xl font-bold">$1.2B</div>
                          <p className="text-xs text-muted-foreground">Total Value Locked</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <PieChart className="h-4 w-4" />
                            <span className="text-sm font-medium">DeFi Protocols</span>
                          </div>
                          <div className="text-2xl font-bold">127</div>
                          <p className="text-xs text-muted-foreground">Active protocols</p>
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
