"use client"

import Link from "next/link"
import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconMoneybag,
  IconReport,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react"

import { NavClouds } from "@/components/nav-clouds"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Payments",
      url: "/payments",
      icon: IconCreditCard,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Products",
      url: "/products",
      icon: IconShoppingCart,
    },
    {
      title: "Team",
      url: "/team",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Payment Processing",
      icon: IconWallet,
      isActive: true,
      url: "/payments",
      items: [
        {
          title: "Stripe Integration",
          url: "/payments/stripe",
        },
        {
          title: "Transaction History",
          url: "/payments/transactions",
        },
        {
          title: "Refunds",
          url: "/payments/refunds",
        },
      ],
    },
    {
      title: "Business Tools",
      icon: IconMoneybag,
      url: "/business",
      items: [
        {
          title: "Invoicing",
          url: "/business/invoicing",
        },
        {
          title: "Subscriptions",
          url: "/business/subscriptions",
        },
        {
          title: "Tax Reports",
          url: "/business/tax",
        },
      ],
    },
    {
      title: "AI Assistant",
      icon: IconFileAi,
      url: "/ai",
      items: [
        {
          title: "Payment Insights",
          url: "/ai/payment-insights",
        },
        {
          title: "Business Analytics",
          url: "/ai/analytics",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Payment Data",
      url: "/data/payments",
      icon: IconDatabase,
    },
    {
      name: "Financial Reports",
      url: "/reports/financial",
      icon: IconReport,
    },
    {
      name: "Business Assistant",
      url: "/assistant",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="text-base font-semibold">Zypto.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <hr className="mt-1"/>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavClouds items={data.navClouds} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
