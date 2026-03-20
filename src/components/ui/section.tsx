import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
}

export function Section({ title, description, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("mb-10", className)} {...props}>
      {title && (
        <div className="mb-4">
          {/* #4/#10: Better visual rhythm and distinct section titles */}
          <h2 className="section-heading text-lg font-bold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1 pl-3">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
