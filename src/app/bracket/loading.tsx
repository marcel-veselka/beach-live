import { Skeleton } from "@/components/ui/skeleton"

export default function BracketLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      {/* Mobile round skeletons */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map(round => (
          <div key={round} className="space-y-2.5">
            <div className="flex items-center gap-2.5 py-3">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-2 w-4 rounded-full" />)}
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            {[1, 2].map(match => (
              <div key={match} className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
