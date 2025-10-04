"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart showing loyalty points over the last 12 months"

// Function to generate last 12 months of data
const generateLast12MonthsData = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const currentDate = new Date()
  const data = []
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthIndex = date.getMonth()
    const monthName = months[monthIndex]
    const year = date.getFullYear()
    
    // Generate realistic loyalty points data (random but trending upward)
    const basePoints = 800 + (11 - i) * 50 // Base trend upward
    const variation = Math.floor(Math.random() * 200) - 100 // Random variation
    const points = Math.max(100, basePoints + variation) // Minimum 100 points
    
    data.push({
      month: `${monthName} ${year}`,
      shortMonth: monthName.slice(0, 3),
      points: points,
      date: date
    })
  }
  
  return data
}

const chartConfig = {
  points: {
    label: "Loyalty Points",
    color: "#ffffff",
  },
} satisfies ChartConfig

export function ChartLineDefault() {
  const chartData = useMemo(() => generateLast12MonthsData(), [])
  
  const currentMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const growthPercentage = previousMonth ? 
    (((currentMonth.points - previousMonth.points) / previousMonth.points) * 100).toFixed(1) : "0.0"
  
  const startDate = chartData[0]
  const endDate = chartData[chartData.length - 1]
  const dateRange = `${startDate.shortMonth} ${startDate.date.getFullYear()} - ${endDate.shortMonth} ${endDate.date.getFullYear()}`
  
  return (
    <Card className="bg-black border-0">
      <CardHeader>
        <CardTitle className="text-white">Loyalty Points Trend</CardTitle>
        <CardDescription className="text-gray-400">{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#374151" />
            <XAxis
              dataKey="shortMonth"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <ChartTooltip
              content={<ChartTooltipContent 
                formatter={(value, name) => [`${value} points`, 'Points']}
                labelFormatter={(label) => `Month: ${label}`}
              />}
            />
            <Line
              dataKey="points"
              type="natural"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-white">
          Trending up by {growthPercentage}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-400 leading-none">
          Showing loyalty points earned over the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}
