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
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

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
    image: "https://logos-world.net/wp-content/uploads/2020/09/Starbucks-Logo.png",
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
    image: "https://logos-world.net/wp-content/uploads/2020/09/Uber-Logo.png",
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
    image: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
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
    image: "https://logos-world.net/wp-content/uploads/2020/09/Spotify-Logo.png",
    category: "Entertainment",
    validUntil: "Mar 31, 2025",
    popular: false
  },
  {
    id: 5,
    title: "Netflix Subscription",
    description: "2 months free premium",
    points: 700,
    originalPrice: 30,
    discountedPrice: 0,
    image: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    category: "Entertainment",
    validUntil: "Apr 30, 2025",
    popular: true
  },
  {
    id: 6,
    title: "Steam Gift Card",
    description: "Gaming credits $25",
    points: 600,
    originalPrice: 25,
    discountedPrice: 0,
    image: "https://logos-world.net/wp-content/uploads/2020/09/Steam-Logo.png",
    category: "Gaming",
    validUntil: "May 15, 2025",
    popular: false
  },
  {
    id: 7,
    title: "McDonald's Voucher",
    description: "Free Big Mac meal",
    points: 350,
    originalPrice: 12,
    discountedPrice: 0,
    image: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png",
    category: "Food & Dining",
    validUntil: "Jun 30, 2025",
    popular: true
  },
  {
    id: 8,
    title: "Apple Store Credit",
    description: "$50 off accessories",
    points: 1000,
    originalPrice: 50,
    discountedPrice: 0,
    image: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
    category: "Technology",
    validUntil: "Jul 31, 2025",
    popular: true
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
  const [activeTab, setActiveTab] = useState<"swap" | "exchange">("swap");
  const [autoRedeemEnabled, setAutoRedeemEnabled] = useState(false);

  // Redirect if not authenticated
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Redeem Lypto Points</h1>
          <p className="text-gray-400">
            Swap your loyalty points for crypto or redeem exclusive offers.
          </p>
        </div>

        {/* Crypto Swap Section */}
        <div className=" bg-black text-white flex items-center justify-center p-4">
          <div className="w-full max-w-xl">

            {/* Swap Container */}
            <div className="space-y-8">
              {/* You Pay Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400 text-sm font-light">
                    <span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white">Auto redeem on checkouts</span>
                    <Switch
                      checked={autoRedeemEnabled}
                      onCheckedChange={setAutoRedeemEnabled}
                      className="data-[state=checked]:bg-[#55efc4] data-[state=unchecked]:bg-[#fab1a0]"
                    />
                  </div>
                </div>
                <div className="bg-[#1A1A1A] rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#fff] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <span className="text-2xl font-light">Lypto Points</span>
                    </button>
                    <div className="text-right">
                      <div className="text-5xl font-light tracking-tight">20.20</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400 font-light">
                      Balance: <span className="text-gray-400">0.00</span>{" "}
                      <span className="text-[#2ecc71] cursor-pointer hover:opacity-80">Max</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center -my-4 relative z-10">
                <button className="w-14 h-14 rounded-full bg-[#1A1A1A] border-4 border-black flex items-center justify-center hover:bg-[#252525] transition-colors">
                  <RefreshCw className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* You Receive Section */}
              <div>
                <div className="text-gray-400 text-sm mb-4 font-light">You Receive</div>
                <div className="bg-[#1A1A1A] rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[white] border border-gray-700 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#000]" fill="currentColor">
                          <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4z" />
                        </svg>
                      </div>
                      <span className="text-2xl font-light">USDC</span>
                    </button>
                    <div className="text-right">
                      <div className="text-5xl font-light tracking-tight">0.00</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400 font-light">
                      Balance: <span className="text-[#2ecc71]">0.00</span>
                    </div>
                    <div className="text-gray-400 font-light">= $0.00</div>
                  </div>
                </div>
              </div>

              {/* Connect Wallet Button and Gas Fee */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <Button className="flex-1 bg-[#fff] cursor-pointer text-black text-xl py-7 rounded-full font-light">
                  Redeem Lypto Points
                </Button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">$0.185</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Offers Section */}
      <Card className="bg-black border-0 mt-10 w-full">
        <CardContent>
          {/* Auto-scrolling Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-4">
              {/* Duplicate offers for seamless loop */}
              {[...offers, ...offers].map((offer, index) => (
                <Card key={`${offer.id}-${index}`} className="flex-shrink-0 w-80 bg-black border-0 cursor-pointer hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src={offer.image}
                            alt={offer.title}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
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
    </div>
  );
}
