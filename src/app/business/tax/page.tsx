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
import { Receipt, Search, Filter, Download, Eye, Calendar, DollarSign, FileText } from "lucide-react"

export default function TaxReportsPage() {
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
                      <h1 className="text-3xl font-bold tracking-tight">Tax Reports</h1>
                      <p className="text-muted-foreground">
                        Generate and manage your tax reports and filings
                      </p>
                    </div>
                    <Button>
                      <Receipt className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
                
                {/* Tax Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$3,847</div>
                      <p className="text-xs text-muted-foreground">
                        This quarter
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tax Rate</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8.5%</div>
                      <p className="text-xs text-muted-foreground">
                        Average rate
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        This month
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Next Filing</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Jan 31</div>
                      <p className="text-xs text-muted-foreground">
                        15 days remaining
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tax Reports */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Reports</CardTitle>
                      <CardDescription>
                        View and download your tax reports
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search reports..." className="pl-8" />
                        </div>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export All
                        </Button>
                      </div>
                      
                      {/* Report List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Q4 2023 Tax Report</h3>
                              <p className="text-sm text-muted-foreground">October - December 2023</p>
                              <p className="text-xs text-muted-foreground">Generated: Jan 15, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">$1,247.50</p>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Q3 2023 Tax Report</h3>
                              <p className="text-sm text-muted-foreground">July - September 2023</p>
                              <p className="text-xs text-muted-foreground">Generated: Oct 15, 2023</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">$1,089.25</p>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Q1 2024 Tax Report</h3>
                              <p className="text-sm text-muted-foreground">January - March 2024</p>
                              <p className="text-xs text-muted-foreground">Due: Apr 15, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">$1,512.75</p>
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
