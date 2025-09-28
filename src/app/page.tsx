"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
      <Header />
      <main>
        <section className="bg-white dark:bg-black border-b border-gray-400/50">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl text-white font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">Powering borderless access to <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">global products</span>.</h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">3/4 online businesses utilize payment processors for their products and subscriptions but limited to pay with Visa, Mastercard, etc.</p>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Our vision is to make your products and services accessible to a global audience—without the limitations of card-only payments.</p>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ">
                👋 Get started
              </a>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ">
                📖 Documentation
              </a>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img src="https://images.unsplash.com/photo-1545941962-1b6654eb8072?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="mockup" />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-black">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="max-w-screen-md">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for businesses like yours.</h2>
              <p className="text-gray-500 sm:text-xl dark:text-gray-400">Here at Zypto we focus on markets where technology, innovation, and capital can unlock economic growth and borderless access to global products.</p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-black">
          <div className="max-w-screen-xl mx-auto px-4 pb-8 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <Link href="/" className="flex items-center mb-4">
                  <Image
                    src="/logo.png"
                    alt="Zypto Logo"
                    width={24}
                    height={24}
                    className="mr-2 h-6 w-auto"
                  />
                  <span className="text-xl font-semibold dark:text-white">Zypto</span>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Powering borderless access to global products through crypto payment processing.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Product
                </h3>
                <ul className="space-y-2">

                  <li>
                    <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  © 2025 Zypto by Ming Open Web Headquarters. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
