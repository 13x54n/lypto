"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  CreditCard,
  Wallet,
  Gift,
  ShoppingBag
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN001",
    date: "2024-12-15",
    merchant: "Coffee Shop Downtown",
    type: "earned",
    points: 25,
    amount: 12.50,
    status: "completed",
    category: "Food & Dining"
  },
  {
    id: "TXN002", 
    date: "2024-12-14",
    merchant: "Grocery Store",
    type: "spent",
    points: -50,
    amount: 0,
    status: "completed",
    category: "Groceries"
  },
  {
    id: "TXN003",
    date: "2024-12-13", 
    merchant: "Restaurant ABC",
    type: "earned",
    points: 40,
    amount: 35.00,
    status: "completed",
    category: "Food & Dining"
  },
  {
    id: "TXN004",
    date: "2024-12-12",
    merchant: "Gas Station",
    type: "spent",
    points: -30,
    amount: 0,
    status: "completed", 
    category: "Transportation"
  },
  {
    id: "TXN005",
    date: "2024-12-11",
    merchant: "Online Store",
    type: "earned",
    points: 75,
    amount: 150.00,
    status: "completed",
    category: "Shopping"
  },
  {
    id: "TXN006",
    date: "2024-12-10",
    merchant: "Gift Card Purchase",
    type: "earned",
    points: 100,
    amount: 200.00,
    status: "completed",
    category: "Shopping"
  },
  {
    id: "TXN007",
    date: "2024-12-09",
    merchant: "Movie Theater",
    type: "earned",
    points: 15,
    amount: 25.00,
    status: "completed",
    category: "Entertainment"
  },
  {
    id: "TXN008",
    date: "2024-12-08",
    merchant: "Points Redemption",
    type: "spent",
    points: -100,
    amount: 0,
    status: "completed",
    category: "Redemption"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Food & Dining":
      return <ShoppingBag className="h-4 w-4" />;
    case "Groceries":
      return <ShoppingBag className="h-4 w-4" />;
    case "Transportation":
      return <Wallet className="h-4 w-4" />;
    case "Shopping":
      return <Gift className="h-4 w-4" />;
    case "Entertainment":
      return <CreditCard className="h-4 w-4" />;
    case "Redemption":
      return <Wallet className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

export default function TransactionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "points":
          comparison = a.points - b.points;
          break;
        case "merchant":
          comparison = a.merchant.localeCompare(b.merchant);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "-";
    return `$${amount.toFixed(2)}`;
  };

  const totalEarned = transactions
    .filter(t => t.type === "earned")
    .reduce((sum, t) => sum + t.points, 0);

  const totalSpent = transactions
    .filter(t => t.type === "spent")
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  return (
    <div className="min-h-screen bg-black">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-gray-400">
            View and manage all your loyalty point transactions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-black border-0 mb-6">
          <div className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 bg-white border-gray-700 text-black">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="earned">Points Earned</SelectItem>
                  <SelectItem value="spent">Points Spent</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="bg-white border-gray-700 text-black hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-black border-0">
          <div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-black/50">
                  <TableHead className="text-gray-300 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="text-gray-300 hover:text-white p-0 h-auto font-medium"
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("merchant")}
                      className="text-gray-300 hover:text-white p-0 h-auto font-medium"
                    >
                      Merchant
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300 font-medium">Category</TableHead>
                  <TableHead className="text-gray-300 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-300 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("points")}
                      className="text-gray-300 hover:text-white p-0 h-auto font-medium"
                    >
                      Points
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-black/50">
                    <TableCell className="text-gray-300">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {transaction.merchant}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(transaction.category)}
                        <span className="text-gray-300">{transaction.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === "earned" ? "default" : "secondary"}
                        className={transaction.type === "earned" 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "bg-red-600 hover:bg-red-700 text-white"
                        }
                      >
                        {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
