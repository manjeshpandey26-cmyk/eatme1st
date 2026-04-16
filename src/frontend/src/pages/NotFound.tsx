import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Home, Search, UtensilsCrossed } from "lucide-react";
import { Layout } from "../components/Layout";

export function NotFoundPage() {
  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-8"
        data-ocid="notfound.page"
      >
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-primary" />
        </div>

        {/* Copy */}
        <div className="space-y-3 max-w-md">
          <p className="text-7xl font-display font-black text-primary/20 leading-none">
            404
          </p>
          <h1 className="font-display font-bold text-3xl text-foreground">
            This page doesn&apos;t exist
          </h1>
          <p className="text-muted-foreground text-base">
            Looks like this page got eaten before you could get here. Let&apos;s
            find you something delicious instead.
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap gap-3 justify-center"
          data-ocid="notfound.actions"
        >
          <Link to="/" data-ocid="notfound.home_link">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/" data-ocid="notfound.browse_link">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
