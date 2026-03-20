import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        live: "bg-live/15 text-live border border-live/20 animate-pulse",
        finished: "bg-muted text-muted-foreground border border-border/50",
        scheduled: "bg-secondary/10 text-secondary-foreground border border-secondary/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        success: "bg-success/10 text-success border border-success/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
