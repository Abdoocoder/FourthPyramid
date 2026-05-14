interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-surface-container rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-7">
          <Skeleton className="aspect-[4/3]" />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
        <div className="md:col-span-5 flex flex-col gap-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminShellSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex">
      <div className="hidden md:flex w-64 flex-col gap-4 p-6 border-r border-outline-variant">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <AdminPageSkeleton />
      </div>
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-surface-container-low flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
