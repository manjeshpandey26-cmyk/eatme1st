import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Package, RotateCcw, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { Layout } from "../components/Layout";
import { OrderCardSkeleton } from "../components/LoadingSpinner";
import { useGetOrderHistory } from "../hooks/useBackend";
import { ORDER_STATUS_CONFIG, formatCents, formatTimestamp } from "../types";
import type { Order, OrderStatusKey } from "../types";

function StatusBadge({ status }: { status: string }) {
  const key = status as OrderStatusKey;
  const config = ORDER_STATUS_CONFIG[key] ?? ORDER_STATUS_CONFIG.confirmed;

  const colorStyle: CSSProperties = (() => {
    switch (key) {
      case "confirmed":
        return {
          background: "oklch(var(--primary) / 0.12)",
          color: "oklch(var(--primary))",
          borderColor: "oklch(var(--primary) / 0.3)",
        };
      case "beingPrepared":
        return {
          background: "oklch(var(--accent) / 0.12)",
          color: "oklch(var(--accent))",
          borderColor: "oklch(var(--accent) / 0.3)",
        };
      case "readyForPickup":
        return {
          background: "oklch(var(--primary) / 0.1)",
          color: "oklch(var(--primary))",
          borderColor: "oklch(var(--primary) / 0.25)",
        };
      case "driverAssigned":
        return {
          background: "oklch(var(--primary) / 0.08)",
          color: "oklch(var(--primary) / 0.9)",
          borderColor: "oklch(var(--primary) / 0.2)",
        };
      case "inTransit":
        return {
          background: "oklch(var(--accent) / 0.1)",
          color: "oklch(var(--accent) / 0.9)",
          borderColor: "oklch(var(--accent) / 0.25)",
        };
      case "delivered":
        return {
          background: "oklch(0.62 0.18 145 / 0.12)",
          color: "oklch(0.45 0.18 145)",
          borderColor: "oklch(0.62 0.18 145 / 0.3)",
        };
      default:
        return {};
    }
  })();

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border"
      style={key === "cancelled" ? {} : colorStyle}
      data-ocid="order.status_badge"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const navigate = useNavigate();
  const itemCount = order.items.reduce((sum, i) => sum + Number(i.quantity), 0);
  const itemSummary = order.items
    .slice(0, 3)
    .map(
      (i) =>
        `${i.menuItemName}${Number(i.quantity) > 1 ? ` ×${i.quantity}` : ""}`,
    )
    .join(", ");
  const hasMore = order.items.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Card
        className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-smooth group"
        onClick={() =>
          navigate({
            to: "/orders/$orderId",
            params: { orderId: order.id.toString() },
          })
        }
        data-ocid={`orders.item.${index + 1}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate font-display text-base group-hover:text-primary transition-colors">
                {order.restaurantName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {formatTimestamp(order.createdAt)}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-3 pl-13">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {itemSummary}
            {hasMore && ` +${order.items.length - 3} more`}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <span className="text-foreground font-semibold">
                {formatCents(order.totalCents)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium h-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: `/restaurants/${order.restaurantId}` });
              }}
              data-ocid={`orders.reorder_button.${index + 1}`}
            >
              <RotateCcw className="w-3 h-3" />
              Reorder
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyOrders() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="orders.empty_state"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold font-display text-foreground mb-2">
        No orders yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        Your order history will appear here once you place your first order.
      </p>
      <Button
        onClick={() => navigate({ to: "/" })}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6"
        data-ocid="orders.browse_button"
      >
        Browse Restaurants
      </Button>
    </div>
  );
}

export function OrdersPage() {
  const { data: orders, isLoading } = useGetOrderHistory();

  const sorted = orders
    ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold font-display text-foreground">
              Your Orders
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {sorted.length > 0
                ? `${sorted.length} order${sorted.length !== 1 ? "s" : ""} total`
                : "Track and reorder your favorites"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6" data-ocid="orders.list">
          {isLoading ? (
            <div className="space-y-4" data-ocid="orders.loading_state">
              {[1, 2, 3].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-4">
              {sorted.map((order, i) => (
                <OrderCard key={order.id.toString()} order={order} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
