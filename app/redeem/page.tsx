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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  ChevronDown,
  Gift,
  Star,
  ShoppingBag,
  Plane,
  Coffee,
  Car,
  Gamepad2,
  Music,
  Zap,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock crypto data
const cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", price: 43250.50, change: "+2.5%" },
  { symbol: "ETH", name: "Ethereum", price: 2680.25, change: "+1.8%" },
  { symbol: "SOL", name: "Solana", price: 98.75, change: "+5.2%" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change: "0.0%" },
  { symbol: "LYPTO", name: "Lypto Points", price: 0.01, change: "0.0%" }
];

// Mock offers data
const offers = [
  {
    id: 1,
    title: "Starbucks Gift Card",
    description: "50% off on your next coffee",
    points: 500,
    originalPrice: 25,
    discountedPrice: 12.50,
    image: "☕",
    category: "Food & Dining",
    validUntil: "Dec 31, 2024",
    popular: true
  },
  {
    id: 2,
    title: "Uber Credits",
    description: "Free ride up to $15",
    points: 300,
    originalPrice: 15,
    discountedPrice: 0,
    image: "🚗",
    category: "Transportation",
    validUntil: "Jan 15, 2025",
    popular: false
  },
  {
    id: 3,
    title: "Amazon Gift Card",
    description: "20% bonus on purchase",
    points: 800,
    originalPrice: 50,
    discountedPrice: 40,
    image: "📦",
    category: "Shopping",
    validUntil: "Feb 28, 2025",
    popular: true
  },
  {
    id: 4,
    title: "Spotify Premium",
    description: "3 months free subscription",
    points: 400,
    originalPrice: 30,
    discountedPrice: 0,
    image: "🎵",
    category: "Entertainment",
    validUntil: "Mar 31, 2025",
    popular: false
  },
  {
    id: 5,
    title: "Flight Voucher",
    description: "$100 off domestic flights",
    points: 1200,
    originalPrice: 100,
    discountedPrice: 0,
    image: "✈️",
    category: "Travel",
    validUntil: "Apr 30, 2025",
    popular: true
  },
  {
    id: 6,
    title: "Gaming Credits",
    description: "Steam Wallet $25",
    points: 600,
    originalPrice: 25,
    discountedPrice: 0,
    image: "🎮",
    category: "Gaming",
    validUntil: "May 15, 2025",
    popular: false
  }
];

export default function RedeemPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [fromAsset, setFromAsset] = useState("LYPTO");
  const [toAsset, setToAsset] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [userPoints, setUserPoints] = useState(1250);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Calculate conversion when amounts change
    if (fromAmount && fromAsset !== toAsset) {
      const fromCrypto = cryptoAssets.find(c => c.symbol === fromAsset);
      const toCrypto = cryptoAssets.find(c => c.symbol === toAsset);
      
      if (fromCrypto && toCrypto) {
        const amount = parseFloat(fromAmount);
        const convertedAmount = (amount * fromCrypto.price) / toCrypto.price;
        setToAmount(convertedAmount.toFixed(6));
      }
    }
  }, [fromAmount, fromAsset, toAsset]);

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

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

  return (
    <div className="min-h-screen bg-black">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Redeem & Rewards</h1>
          <p className="text-gray-400">
            Swap your loyalty points for crypto or redeem exclusive offers
          </p>
        </div>

        {/* Crypto Swap Section */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Crypto Swap
            </CardTitle>
            <CardDescription className="text-gray-400">
              Convert your loyalty points to cryptocurrencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* From Asset */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">From</label>
                <div className="flex gap-2">
                  <Select value={fromAsset} onValueChange={setFromAsset}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {cryptoAssets.map((asset) => (
                        <SelectItem key={asset.symbol} value={asset.symbol} className="text-white">
                          {asset.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                {fromAsset === "ZYPTO" && (
                  <p className="text-xs text-gray-400">Available: {userPoints} points</p>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapAssets}
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To Asset */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">To</label>
                <div className="flex gap-2">
                  <Select value={toAsset} onValueChange={setToAsset}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {cryptoAssets.map((asset) => (
                        <SelectItem key={asset.symbol} value={asset.symbol} className="text-white">
                          {asset.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <Button className="w-full bg-white text-black hover:bg-gray-200 mt-6">
                <Zap className="h-4 w-4 mr-2" />
                Swap Now
              </Button>

              {/* Rate Info */}
              <div className="text-center text-sm text-gray-400">
                1 {fromAsset} = {(parseFloat(toAmount) / parseFloat(fromAmount || "1")).toFixed(6)} {toAsset}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Exclusive Offers
            </CardTitle>
            <CardDescription className="text-gray-400">
              Redeem your points for amazing rewards and discounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Auto-scrolling Carousel */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll space-x-4">
                {/* Duplicate offers for seamless loop */}
                {[...offers, ...offers].map((offer, index) => (
                  <Card key={`${offer.id}-${index}`} className="flex-shrink-0 w-80 bg-black border-gray-700 hover:border-gray-600 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{offer.image}</span>
                          <div>
                            <CardTitle className="text-white text-lg">{offer.title}</CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                              {offer.description}
                            </CardDescription>
                          </div>
                        </div>
                        {offer.popular && (
                          <Badge className="bg-yellow-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">Points Required</div>
                        <div className="text-white font-semibold">{offer.points} pts</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">Value</div>
                        <div className="text-right">
                          {offer.discountedPrice === 0 ? (
                            <span className="text-green-400 font-semibold">FREE</span>
                          ) : (
                            <div>
                              <span className="text-gray-400 line-through text-sm">${offer.originalPrice}</span>
                              <span className="text-white font-semibold ml-2">${offer.discountedPrice}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-gray-700 text-gray-300">
                          {offer.category}
                        </Badge>
                        <div className="text-xs text-gray-400">
                          Valid until {offer.validUntil}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-white text-black hover:bg-gray-200"
                        disabled={userPoints < offer.points}
                      >
                        {userPoints >= offer.points ? "Redeem Now" : "Insufficient Points"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSS for auto-scrolling animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </main>
    </div>
  );
}
