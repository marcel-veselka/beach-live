import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        live: "bg-live/10 text-live animate-pulse",
        finished: "bg-muted text-muted-foreground",
        scheduled: "bg-secondary/10 text-secondary-foreground",
        warning: "bg-warning/10 text-warning",
        success: "bg-success/10 text-success",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
