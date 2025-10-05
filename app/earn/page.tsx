"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Users,
  Copy,
  Gift,
  TrendingUp,
  Share2,
  CheckCircle,
  Star,
  Target,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button"

export default function EarnPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 12,
    totalEarned: 1200,
    pendingRewards: 150,
    level: "Gold"
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Generate referral code based on user info
    if (user) {
      const userCode = user.email?.split('@')[0].toUpperCase() || 'USER';
      setReferralCode(`${userCode}2024`);
    }
  }, [user]);

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareReferral = () => {
    const shareText = `Join Zypto and earn loyalty points! Use my referral code: ${referralCode}`;
    const shareUrl = `${window.location.origin}?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Zypto',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Earn Points</h1>
          <p className="text-gray-400">
            Refer friends and earn loyalty points for every successful referral
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">{referralStats.totalReferrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Points Earned</p>
                  <p className="text-2xl font-bold text-white">+{referralStats.totalEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Rewards</p>
                  <p className="text-2xl font-bold text-white">+{referralStats.pendingRewards}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-0">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Referral Level</p>
                  <p className="text-2xl font-bold text-white">{referralStats.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Section */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
            <CardDescription className="text-gray-400">
              Share this code with friends to earn points when they join
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={referralCode}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white text-lg font-mono text-center"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={shareReferral}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              How Referrals Work
            </CardTitle>
            <CardDescription className="text-gray-400">
              Earn points by referring friends to Zypto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Share Your Code</h3>
                <p className="text-gray-400 text-sm">
                  Share your unique referral code with friends via social media, email, or messaging
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Friend Signs Up</h3>
                <p className="text-gray-400 text-sm">
                  Your friend creates an account using your referral code and makes their first purchase
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Earn Rewards</h3>
                <p className="text-gray-400 text-sm">
                  You both earn bonus points! You get 100 points, your friend gets 50 points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Rewards */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Referral Rewards
            </CardTitle>
            <CardDescription className="text-gray-400">
              Earn more points as you reach higher referral levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-600 text-white">Bronze</Badge>
                  <span className="text-white">0-5 referrals</span>
                </div>
                <span className="text-green-400 font-semibold">50 points per referral</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-600 text-white">Silver</Badge>
                  <span className="text-white">6-15 referrals</span>
                </div>
                <span className="text-green-400 font-semibold">75 points per referral</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-600 text-white">Gold</Badge>
                  <span className="text-white">16-30 referrals</span>
                </div>
                <span className="text-green-400 font-semibold">100 points per referral</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-600 text-white">Platinum</Badge>
                  <span className="text-white">31+ referrals</span>
                </div>
                <span className="text-green-400 font-semibold">150 points per referral</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Referrals */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Referrals</CardTitle>
            <CardDescription className="text-gray-400">
              Your latest successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", date: "Dec 15, 2024", points: 100, status: "completed" },
                { name: "Mike Chen", date: "Dec 14, 2024", points: 100, status: "completed" },
                { name: "Lisa Wang", date: "Dec 12, 2024", points: 100, status: "completed" },
                { name: "David Brown", date: "Dec 10, 2024", points: 100, status: "pending" }
              ].map((referral, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{referral.name}</p>
                      <p className="text-gray-400 text-sm">{referral.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={referral.status === "completed" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      }
                    >
                      {referral.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                    <p className="text-green-400 font-semibold mt-1">+{referral.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
