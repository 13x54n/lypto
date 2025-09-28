"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/AuthGuard"
import { usePayments, useDashboardStats, useChartData, useSectionCards } from "@/hooks/use-dashboard-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { IconRefresh } from "@tabler/icons-react"

export default function Page() {
  const { data: payments, loading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = usePayments()
  const { data: stats, loading: statsLoading, error: statsError } = useDashboardStats()
  const { data: chartData, loading: chartLoading, error: chartError } = useChartData()
  const { data: sectionCards, loading: cardsLoading, error: cardsError } = useSectionCards()

  const isLoading = paymentsLoading || statsLoading || chartLoading || cardsLoading
  const hasError = paymentsError || statsError || chartError || cardsError

  const handleRefresh = () => {
    refetchPayments()
  }

  if (hasError) {
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
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <Alert className="max-w-md">
                <AlertDescription className="text-center">
                  {paymentsError || statsError || chartError || cardsError}
                </AlertDescription>
              </Alert>
              <Button onClick={handleRefresh} className="mt-4">
                <IconRefresh className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    )
  }

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
                {cardsLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                ) : (
                  <SectionCards data={sectionCards} />
                )}
                
                <div className="px-4 lg:px-6">
                  {chartLoading ? (
                    <Skeleton className="h-80 w-full" />
                  ) : (
                    <ChartAreaInteractive data={chartData} />
                  )}
                </div>
                
                {paymentsLoading ? (
                  <div className="px-4 lg:px-6">
                    <Skeleton className="h-96 w-full" />
                  </div>
                ) : (
                  <DataTable data={payments} />
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
