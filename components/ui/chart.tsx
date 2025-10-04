"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { useId } from "react"

import { cn } from "@/lib/utils"

// Chart container
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: colorConfig
          .map(
            ([key, itemConfig]) =>
              `[data-chart=${id}] .color-${key} { color: hsl(var(--color-${key})) }`
          )
          .join("\n"),
      }}
    />
  )
}

// Chart tooltip
interface ChartTooltipProps extends Omit<RechartsPrimitive.TooltipProps<any, any>, "content"> {
  content?: React.ComponentProps<typeof RechartsPrimitive.Tooltip>["content"]
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  category?: string
  className?: string
  formatter?: (value: number, name: string, item: any, index: number) => [React.ReactNode, string]
  labelFormatter?: (label: string, payload: any[]) => React.ReactNode
  color?: string
  indicator?: "line" | "dot" | "dashed" | "none"
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      label,
      category,
      className,
      formatter,
      labelFormatter,
      color,
      indicator = "dot",
      ...props
    },
    ref
  ) => {
    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {category && (
          <div className="flex items-center gap-2 border-b border-border/50 pb-1">
            <div
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
            <span className="font-mono text-muted-foreground uppercase">
              {category}
            </span>
          </div>
        )}
        <div className="grid gap-1.5">
          {label && (
            <div className="font-medium text-foreground">
              {labelFormatter
                ? labelFormatter(label, payload)
                : label}
            </div>
          )}
          <div className="grid gap-1.5">
            {payload.map((item, index) => {
              const [value, name] = formatter
                ? formatter(item.value, item.name, item, index)
                : [item.value, item.name]

              return (
                <div
                  key={item.dataKey}
                  className="flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-muted-foreground"
                >
                  {indicator === "dot" && (
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                  {indicator === "line" && (
                    <div
                      className="h-0.5 w-3 shrink-0"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                  {indicator === "dashed" && (
                    <div
                      className="h-0.5 w-3 shrink-0 border-t-2 border-dashed"
                      style={{
                        borderColor: item.color,
                      }}
                    />
                  )}
                  <div className="flex flex-1 justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.name && (
                        <span className="text-muted-foreground">
                          {name}
                        </span>
                      )}
                    </div>
                    {item.value && (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// Chart legend
const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps {
  className?: string
  hideIcon?: boolean
  children?: (props: any) => React.ReactNode
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(({ className, hideIcon = false, children, ...props }, ref) => {
  const renderLegend = (legendProps: any) => {
    const { payload } = legendProps

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-4", className)}
        {...props}
      >
        {children
          ? children(legendProps)
          : payload?.map((entry: any, index: number) => (
              <div
                key={`legend-${index}`}
                className={cn(
                  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                )}
              >
                {!hideIcon && (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: entry.color,
                    }}
                  />
                )}
                {entry.value}
              </div>
            ))}
      </div>
    )
  }

  return renderLegend(props)
})
ChartLegendContent.displayName = "ChartLegend"

// Types
type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
  type ChartTooltipProps,
}
