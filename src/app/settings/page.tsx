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
import { Settings, User, Shield, Bell, CreditCard, Globe, Save } from "lucide-react"

export default function SettingsPage() {
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
                  <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account and application settings
                  </p>
                </div>
                
                {/* Settings Categories */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@company.com" />
                      </div>
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Security</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <Button variant="outline">
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </CardTitle>
                      <CardDescription>
                        Configure notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Notifications</span>
                        <Badge variant="secondary">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Notifications</span>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Badge variant="secondary">Enabled</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Settings */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Settings</span>
                      </CardTitle>
                      <CardDescription>
                        Configure your payment processing settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Default Currency</Label>
                          <Input id="currency" defaultValue="USD" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                          <Input id="tax-rate" type="number" defaultValue="8.5" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input id="webhook-url" defaultValue="https://api.zypto.com/webhooks" />
                      </div>
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Payment Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Business Settings */}
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Business Settings</span>
                      </CardTitle>
                      <CardDescription>
                        Configure your business information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="business-name">Business Name</Label>
                          <Input id="business-name" defaultValue="Zypto Inc." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business-type">Business Type</Label>
                          <Input id="business-type" defaultValue="Technology" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-address">Business Address</Label>
                        <Input id="business-address" defaultValue="123 Tech Street, San Francisco, CA 94105" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax ID</Label>
                          <Input id="tax-id" defaultValue="12-3456789" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Business Settings
                      </Button>
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
