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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Search, Mail, Phone, Shield, UserCheck, Coins, Zap, Code, Database } from "lucide-react"

export default function TeamPage() {
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
                      <h1 className="text-3xl font-bold tracking-tight">Solana Payment Team</h1>
                      <p className="text-muted-foreground">
                        Manage your Solana payment processing team and roles
                      </p>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Invite Solana Developer
                    </Button>
                  </div>
                </div>
                
                {/* Solana Team Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Solana Developers</CardTitle>
                      <Code className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        +2 new this month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Payment Engineers</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        100% active rate
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Security Experts</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-muted-foreground">
                        Blockchain security specialists
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">DevOps Engineers</CardTitle>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">6</div>
                      <p className="text-xs text-muted-foreground">
                        Infrastructure specialists
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Solana Team Management */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solana Payment Team</CardTitle>
                      <CardDescription>
                        Manage your Solana payment processing team and their specialized roles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search Solana team members..." className="pl-8" />
                        </div>
                        <Button variant="outline">Filter</Button>
                        <Button variant="outline">Sort</Button>
                      </div>
                      
                      {/* Solana Team Members List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="/avatars/01.png" />
                              <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Alex Solana</h3>
                              <p className="text-sm text-muted-foreground">alex.solana@zypto.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">Lead Solana Developer</Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="/avatars/02.png" />
                              <AvatarFallback>MP</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Maria Payment</h3>
                              <p className="text-sm text-muted-foreground">maria.payment@zypto.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">Payment Engineer</Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="/avatars/03.png" />
                              <AvatarFallback>CS</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Carlos Security</h3>
                              <p className="text-sm text-muted-foreground">carlos.security@zypto.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">Blockchain Security Expert</Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="/avatars/04.png" />
                              <AvatarFallback>DI</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Diana Infrastructure</h3>
                              <p className="text-sm text-muted-foreground">diana.infra@zypto.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">DevOps Engineer</Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
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
