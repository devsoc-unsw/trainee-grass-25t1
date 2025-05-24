import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardSkeleton() {
  return (
    <>
      <div className="space-y-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
      <hr className="opacity-25" />
      <Skeleton className="h-16 w-full rounded-md" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </>
  );
}
