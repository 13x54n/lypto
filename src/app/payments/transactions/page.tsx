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
import { CreditCard, Search, Filter, Download, Eye, ArrowUpDown, Coins, Zap, Shield, Clock } from "lucide-react"

export default function TransactionsPage() {
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
                  <h1 className="text-3xl font-bold tracking-tight">Solana Transaction History</h1>
                  <p className="text-muted-foreground">
                    View and manage all Solana payment transactions
                  </p>
                </div>
                
                {/* Solana Transaction Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45,230</div>
                      <p className="text-xs text-muted-foreground">
                        +18% from last month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Successful</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45,084</div>
                      <p className="text-xs text-muted-foreground">
                        99.7% success rate
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Failed</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">146</div>
                      <p className="text-xs text-muted-foreground">
                        0.3% failure rate
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">SOL Volume</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15,420 SOL</div>
                      <p className="text-xs text-muted-foreground">
                        $2,847,000 USD (+12.5% this month)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Transaction Filters */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Transaction History</CardTitle>
                      <CardDescription>
                        Search and filter your Solana payment transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search Solana transactions..." className="pl-8" />
                        </div>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline">
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          Sort
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                      
                      {/* Solana Transaction List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <Coins className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">SOL Payment #TXN-001</h3>
                              <p className="text-sm text-muted-foreground">5.2 SOL → $960.40</p>
                              <p className="text-xs text-muted-foreground">2024-01-15 14:30:22</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">5.2 SOL</p>
                              <Badge variant="secondary">Confirmed</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <Coins className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">USDC Payment #TXN-002</h3>
                              <p className="text-sm text-muted-foreground">1,500 USDC on Solana</p>
                              <p className="text-xs text-muted-foreground">2024-01-15 13:45:18</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">1,500 USDC</p>
                              <Badge variant="secondary">Confirmed</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                              <Zap className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">SOL Payment #TXN-003</h3>
                              <p className="text-sm text-muted-foreground">0.5 SOL → $92.25</p>
                              <p className="text-xs text-muted-foreground">2024-01-15 12:20:45</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">0.5 SOL</p>
                              <Badge variant="destructive">Failed</Badge>
                            </div>
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
                              <h3 className="font-medium">USDT Payment #TXN-004</h3>
                              <p className="text-sm text-muted-foreground">2,000 USDT on Solana</p>
                              <p className="text-xs text-muted-foreground">2024-01-15 11:15:30</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">2,000 USDT</p>
                              <Badge variant="outline">Pending</Badge>
                            </div>
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
