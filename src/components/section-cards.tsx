import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionCardData } from "@/lib/api"

interface SectionCardsProps {
  data?: SectionCardData[]
}

export function SectionCards({ data }: SectionCardsProps) {
  // Default data if no backend data is provided
  const defaultData: SectionCardData[] = [
    {
      title: "Total Revenue",
      value: "15,420 SOL",
      description: "Total revenue generated",
      trend: 24.5,
      trendLabel: "+24.5%"
    },
    {
      title: "Active Subscriptions",
      value: "1,247",
      description: "Active premium and custom subscriptions",
      trend: 31,
      trendLabel: "+31%"
    }
  ]

  const cardsData = data || defaultData
  
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardsData.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.trendLabel}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.description} {card.trend > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground">
              {card.trend > 0 ? 'Growth trend' : 'Decline trend'}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
