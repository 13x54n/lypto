import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Feature } from "@/components/feature";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

export default function Home({
  badge = "✨ Stable Loyalty Points",
  heading = "Loyalty Points for Everyday Expenses",
  description = "Earn stable loyalty points on every purchase. Spend anywhere and get instant discounts on your cheque.",
  buttons = {
    secondary: {
      text: "👋 Get Started",
      url: "/auth",
    },
  },
  image = {
    src: "https://images.unsplash.com/photo-1743529628081-6777a326a4e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) {
  return (
    <main className="min-h-screen bg-black overflow-hidden flex flex-col">
      <div className="mx-auto px-4">
        <section className="py-18">
          <div className="container">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                {badge && (
                  <Badge variant="outline">
                    {badge}
                  </Badge>
                )}
                <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl text-gray-300">
                  {heading}
                </h1>
                <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl text-gray-400">
                  {description}
                </p>
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                  {buttons.secondary && (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href={buttons.secondary.url}>
                        {buttons.secondary.text}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-96 w-full rounded-md object-cover"
              />
            </div>
          </div>
        </section>

        <Feature />
      </div>

    </main>
  );
}