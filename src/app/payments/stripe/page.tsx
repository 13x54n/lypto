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
import { Label } from "@/components/ui/label"
import { CreditCard, Settings, Key, Webhook, CheckCircle, AlertCircle, Coins, Zap, Shield, Clock } from "lucide-react"

export default function StripeIntegrationPage() {
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
                  <h1 className="text-3xl font-bold tracking-tight">Solana Integration</h1>
                  <p className="text-muted-foreground">
                    Configure and manage your Solana payment processing integration
                  </p>
                </div>
                
                {/* Solana Integration Status */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Solana Connection</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">Connected</div>
                      <p className="text-xs text-muted-foreground">
                        Last sync: 30 seconds ago
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">RPC Endpoints</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">
                        Mainnet, Devnet, Testnet
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        Active Solana webhook endpoints
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.7%</div>
                      <p className="text-xs text-muted-foreground">
                        Solana payment success rate
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Configuration */}
                <div className="grid gap-4 md:grid-cols-2 px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana RPC Configuration</CardTitle>
                      <CardDescription>
                        Manage your Solana RPC endpoints and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mainnet-rpc">Mainnet RPC URL</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="mainnet-rpc" 
                            type="password" 
                            defaultValue="https://api.mainnet-beta.solana.com" 
                            className="font-mono"
                          />
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="devnet-rpc">Devnet RPC URL</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="devnet-rpc" 
                            type="password" 
                            defaultValue="https://api.devnet.solana.com" 
                            className="font-mono"
                          />
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">RPC endpoints are valid and working</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Webhook Endpoints</CardTitle>
                      <CardDescription>
                        Configure webhook endpoints for Solana transaction events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Payment Confirmed</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          https://api.zypto.com/webhooks/solana/payment-confirmed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Transaction Failed</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          https://api.zypto.com/webhooks/solana/transaction-failed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Refund Processed</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          https://api.zypto.com/webhooks/solana/refund-processed
                        </p>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Webhook className="mr-2 h-4 w-4" />
                        Add Solana Webhook
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Features */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Features</CardTitle>
                      <CardDescription>
                        Available Solana payment methods and features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">SOL Payments</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Native Solana token payments</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">USDC on Solana</span>
                          </div>
                          <p className="text-sm text-muted-foreground">USD Coin on Solana network</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">USDT on Solana</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Tether USD on Solana network</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Recurring Payments</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Automated Solana subscriptions</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Ultra-Fast Processing</span>
                          </div>
                          <p className="text-sm text-muted-foreground">400ms transaction finality</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Low Fees</span>
                          </div>
                          <p className="text-sm text-muted-foreground">0.00025 SOL per transaction</p>
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
