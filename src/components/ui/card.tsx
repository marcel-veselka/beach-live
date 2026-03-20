import { cn } from "@/lib/utils"

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("mb-3", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("", className)} {...props} />
}
