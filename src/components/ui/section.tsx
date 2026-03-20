import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
}

export function Section({ title, description, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("mb-8", className)} {...props}>
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
