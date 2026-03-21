import { Skeleton } from "@/components/ui/skeleton"

export default function TeamsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
      <Skeleton className="h-4 w-20" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex gap-1.5">
              {[1, 2, 3].map(j => <Skeleton key={j} className="h-5 w-12 rounded-full" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
