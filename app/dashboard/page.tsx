"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Users,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { ChartLineDefault } from "@/components/ui/chart-dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid Skeleton */}
          <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-black border-0">
                <CardContent>
                  <Skeleton className="h-16 w-24 mb-2" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-black border-0">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // AuthGuard handles redirects

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid Skeleton */}
          <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-black border-0">
                <CardContent>
                  <Skeleton className="h-16 w-24 mb-2" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-black border-0">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-black border-0">
            <CardContent>
              <div className="text-6xl font-bold text-gray-200">1,250</div>
              <p className="text-base text-gray-500 mt-2">
                Total Points
              </p>
              <p className="text-sm text-gray-600 mt-1">
                available to spend on rewards.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent>
              <div className="text-6xl font-bold text-gray-200">+450</div>
              <p className="text-base text-gray-500 mt-2">
                Points Earned
              </p>
              <p className="text-sm text-gray-600 mt-1">
                this month from purchases.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent>
              <div className="text-6xl font-bold text-gray-200">23</div>
              <p className="text-base text-gray-500 mt-2">
                Transactions
              </p>
              <p className="text-sm text-gray-600 mt-1">
                this month with points earned.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent>
              <div className="text-6xl font-bold text-gray-200">$127.50</div>
              <p className="text-base text-gray-500 mt-2">
                Total Saved
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Money saved using points.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <ChartLineDefault />
          
          <Card className="bg-black border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest point activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-gray-300 border-gray-600">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300 font-medium">Merchant</TableHead>
                    <TableHead className="text-gray-300 font-medium">Date</TableHead>
                    <TableHead className="text-gray-300 font-medium">Type</TableHead>
                    <TableHead className="text-gray-300 font-medium text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { merchant: "Coffee Shop", points: "+25", date: "2 hours ago", type: "earned" },
                    { merchant: "Grocery Store", points: "-50", date: "1 day ago", type: "spent" },
                    { merchant: "Restaurant", points: "+40", date: "2 days ago", type: "earned" },
                    { merchant: "Gas Station", points: "-30", date: "3 days ago", type: "spent" },
                  ].map((transaction, index) => (
                    <TableRow key={index} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="font-medium text-white">
                        {transaction.merchant}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "earned" ? "default" : "secondary"}
                          className={transaction.type === "earned" ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"}
                        >
                          {transaction.type === "earned" ? "Earned" : "Spent"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${transaction.type === "earned" ? "text-green-400" : "text-red-400"}`}>
                          {transaction.points}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}