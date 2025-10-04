"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  User,
  Wallet
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="size-5" />,
      active: pathname === "/dashboard"
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <CreditCard className="size-5" />,
      active: pathname === "/transactions"
    },
    {
      title: "Earn",
      href: "/earn",
      icon: <BarChart3 className="size-5" />,
      active: pathname === "/earn"
    },
    {
      title: "Redeem & Rewards",
      href: "/redeem",
      icon: <Wallet className="size-5" />,
        active: pathname === "/redeem"
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">Zypto</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? "font-semibold text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info with Popover */}
            <div className="hidden md:flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-1 bg-white rounded-xl px-3 py-1 cursor-pointer hover:bg-gray-300 transition-colors h-auto"
                  >
                    <User className="size-4 text-black" />
                    <span className="text-sm font-medium text-black">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-black border-gray-700" align="end">
                  <div className="space-y-2">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-white">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                        onClick={() => router.push('/settings')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-black border-gray-800">
                  <SheetHeader>
                    <SheetTitle className="text-white">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold">Zypto</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            item.active
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:text-white hover:bg-gray-800"
                          }`}
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      ))}
                    </div>

                    {/* Mobile User Info & Actions */}
                    <div className="border-t border-gray-800 pt-4">
                      <div className="px-2 py-1.5 mb-4">
                        <p className="text-sm font-medium text-white">
                          {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full text-gray-300 border-gray-600 hover:text-white hover:bg-gray-800 justify-start"
                          onClick={() => {
                            router.push('/settings');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full text-gray-300 border-gray-600 hover:text-white hover:bg-gray-800 justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
