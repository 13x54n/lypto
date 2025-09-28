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
import { CreditCard, DollarSign, TrendingUp, Users, Coins, Zap, Shield, Clock } from "lucide-react"

export default function PaymentsPage() {
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
                  <h1 className="text-3xl font-bold tracking-tight">Solana Payments</h1>
                  <p className="text-muted-foreground">
                    Process Solana payments for your business with ultra-fast, low-cost transactions
                  </p>
                </div>
                
                {/* Solana Payment Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">SOL Volume</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15,420 SOL</div>
                      <p className="text-xs text-muted-foreground">
                        $2,847,000 USD (+12.5% this month)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45,230</div>
                      <p className="text-xs text-muted-foreground">
                        +8,420 from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.7%</div>
                      <p className="text-xs text-muted-foreground">
                        +0.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Fee</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.00025 SOL</div>
                      <p className="text-xs text-muted-foreground">
                        ~$0.05 USD per transaction
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Payment Methods */}
                <div className="grid gap-4 md:grid-cols-2 px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Methods</CardTitle>
                      <CardDescription>
                        Configure your Solana payment processing options
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4" />
                          <span>SOL Payments</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4" />
                          <span>USDC on Solana</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4" />
                          <span>USDT on Solana</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Traditional Cards</span>
                        </div>
                        <Badge variant="outline">Optional</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Actions</CardTitle>
                      <CardDescription>
                        Common Solana payment processing tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start">
                        <Coins className="mr-2 h-4 w-4" />
                        Process SOL Payment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Solana Transactions
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="mr-2 h-4 w-4" />
                        Configure Webhooks
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Payment Features */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Features</CardTitle>
                      <CardDescription>
                        Advanced Solana payment processing capabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-medium">Ultra-Fast Processing</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Process payments in 400ms with Solana's high-speed blockchain
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Ultra-Low Fees</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Pay only 0.00025 SOL (~$0.05) per transaction
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Secure & Decentralized</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Built on Solana's secure, decentralized network
                          </p>
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
