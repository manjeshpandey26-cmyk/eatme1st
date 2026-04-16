import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

export function LoadingSpinner({
  size = "md",
  label,
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
        data-ocid="loading_state"
      >
        <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
        {label && (
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-2" data-ocid="loading_state">
      <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}

// Skeleton components
export function RestaurantCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex gap-4 animate-pulse">
      <div className="h-24 w-24 bg-muted rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-16 mt-2" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
        <div className="h-6 bg-muted rounded-full w-24" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}
