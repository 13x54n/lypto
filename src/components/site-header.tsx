"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconBell } from "@tabler/icons-react"

export function SiteHeader() {
  const pathname = usePathname()

  const title = React.useMemo(() => {
    const routeTitles: Array<{ path: string; title: string }> = [
      // Main
      { path: "/dashboard", title: "Dashboard" },
      { path: "/payments", title: "Payments" },
      { path: "/analytics", title: "Analytics" },
      { path: "/products", title: "Products" },
      { path: "/team", title: "Team" },
      // Secondary
      { path: "/settings", title: "Settings" },
      { path: "/help", title: "Get Help" },
      { path: "/search", title: "Search" },
      // Documents
      { path: "/data/payments", title: "Payment Data" },
      { path: "/reports/financial", title: "Financial Reports" },
      { path: "/assistant", title: "Business Assistant" },
    ]

    if (!pathname) return ""

    // Exact match first
    const exact = routeTitles.find((r) => r.path === pathname)
    if (exact) return exact.title

    // Longest prefix match (e.g., /payments/solana -> Payments)
    const byPrefix = [...routeTitles]
      .sort((a, b) => b.path.length - a.path.length)
      .find((r) => pathname.startsWith(r.path + "/") || pathname === r.path)
    if (byPrefix) return byPrefix.title

    // Fallback: format last path segment
    const segments = pathname.split("/").filter(Boolean)
    const last = segments[segments.length - 1] || ""
    const formatted = last
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return formatted || ""
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title || ""}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open notifications">
                <IconBell className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ul className="divide-y">
                  {[
                    { id: 1, title: "Payment received", time: "2m ago" },
                    { id: 2, title: "New user joined team", time: "10m ago" },
                    { id: 3, title: "Report is ready", time: "1h ago" },
                    { id: 4, title: "Low balance alert", time: "3h ago" },
                    { id: 5, title: "Product stock updated", time: "Yesterday" },
                    { id: 6, title: "Weekly summary available", time: "Yesterday" },
                    { id: 7, title: "Invoice #1029 sent", time: "2d ago" },
                    { id: 8, title: "Team permissions updated", time: "3d ago" },
                  ].map((n) => (
                    <li key={n.id} className="px-4 py-3 text-sm">
                      <p className="leading-5">{n.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-2 border-t text-right">
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
