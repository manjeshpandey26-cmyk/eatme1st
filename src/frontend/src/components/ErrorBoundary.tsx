import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[40vh] gap-6 p-8"
          data-ocid="error_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-display font-semibold text-xl text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {this.state.error?.message ??
                "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <Button
            onClick={this.reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Functional error display for query errors
interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      data-ocid="error_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-medium text-foreground">Something went wrong</p>
        <p className="text-sm text-muted-foreground">
          {message ?? "Unable to load data. Please try again."}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          size="sm"
          data-ocid="error_state.retry_button"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
