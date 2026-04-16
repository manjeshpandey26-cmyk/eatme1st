import { Card } from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  MapPin,
  Package,
  Truck,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties, ElementType } from "react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { OrderCardSkeleton } from "../components/LoadingSpinner";
import { useGetOrder } from "../hooks/useBackend";
import { ORDER_STATUS_CONFIG, formatCents, formatTimestamp } from "../types";
import type { OrderStatusKey } from "../types";

const STEPS: {
  key: OrderStatusKey;
  label: string;
  icon: ElementType;
  desc: string;
}[] = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: CheckCircle2,
    desc: "Restaurant received your order",
  },
  {
    key: "beingPrepared",
    label: "Being Prepared",
    icon: ChefHat,
    desc: "The kitchen is cooking your food",
  },
  {
    key: "readyForPickup",
    label: "Ready for Pickup",
    icon: Package,
    desc: "Order packed and ready",
  },
  {
    key: "driverAssigned",
    label: "Driver Assigned",
    icon: UserCheck,
    desc: "A driver is heading to the restaurant",
  },
  {
    key: "inTransit",
    label: "On the Way",
    icon: Truck,
    desc: "Your order is heading to you",
  },
  {
    key: "delivered",
    label: "Delivered!",
    icon: CheckCircle2,
    desc: "Enjoy your meal!",
  },
];

const STEP_INDEX: Record<OrderStatusKey, number> = {
  confirmed: 0,
  beingPrepared: 1,
  readyForPickup: 2,
  driverAssigned: 3,
  inTransit: 4,
  delivered: 5,
  cancelled: -1,
};

const STEP_COLOR_STYLE: Record<string, CSSProperties> = {
  confirmed: { background: "oklch(var(--primary))" },
  beingPrepared: { background: "oklch(var(--accent))" },
  readyForPickup: { background: "oklch(var(--primary))" },
  driverAssigned: { background: "oklch(var(--primary) / 0.8)" },
  inTransit: { background: "oklch(var(--accent) / 0.9)" },
  delivered: { background: "oklch(0.62 0.18 145)" },
};

function Countdown({ targetMs }: { targetMs: number }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetMs - Date.now()),
  );

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(
      () => setRemaining((r) => Math.max(0, r - 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [remaining]);

  if (remaining <= 0)
    return <span className="text-green-600 font-semibold">Arriving now!</span>;

  const mins = Math.floor(remaining / 60_000);
  const secs = Math.floor((remaining % 60_000) / 1000);
  return (
    <span className="font-semibold tabular-nums text-primary">
      {mins}m {secs.toString().padStart(2, "0")}s
    </span>
  );
}

export function OrderTrackingPage() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const orderIdBigInt = orderId ? BigInt(orderId) : null;

  const { data: order, isLoading, isFetching } = useGetOrder(orderIdBigInt);

  if (isLoading) {
    return (
      <Layout>
        <div
          className="max-w-xl mx-auto px-4 py-8 space-y-4"
          data-ocid="tracking.loading_state"
        >
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
          data-ocid="tracking.error_state"
        >
          <Package className="w-14 h-14 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold font-display mb-2">
            Order not found
          </h2>
          <p className="text-muted-foreground">
            We couldn't find order #{orderId}.
          </p>
        </div>
      </Layout>
    );
  }

  const statusKey = order.status as OrderStatusKey;
  const currentStep = STEP_INDEX[statusKey] ?? 0;
  const isCancelled = statusKey === "cancelled";
  const estimatedMs = Number(order.estimatedDeliveryTime) / 1_000_000;
  const activeColorStyle = STEP_COLOR_STYLE[statusKey] ?? {
    background: "oklch(var(--primary))",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-5">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  {order.restaurantName}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Ordered {formatTimestamp(order.createdAt)}
                </p>
              </div>
              {isFetching && (
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  title="Live updating"
                />
              )}
            </div>

            {!isCancelled && statusKey !== "delivered" && (
              <div className="mt-4 flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-3 border border-primary/10">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Estimated arrival:
                </span>
                <Countdown targetMs={estimatedMs} />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
          {/* Status stepper */}
          <Card
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="tracking.stepper"
          >
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground font-display text-sm uppercase tracking-wide text-muted-foreground">
                Order Progress
              </h2>
            </div>
            <div className="px-5 py-5">
              {isCancelled ? (
                <div
                  className="flex items-center gap-3 py-4"
                  data-ocid="tracking.cancelled_state"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Order Cancelled
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This order was cancelled.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {STEPS.map((step, i) => {
                    const isComplete = i < currentStep;
                    const isActive = i === currentStep;
                    const isPending = i > currentStep;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex gap-4"
                        data-ocid={`tracking.step.${i + 1}`}
                      >
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={isActive ? { scale: 0.8 } : false}
                            animate={isActive ? { scale: [0.8, 1.1, 1] } : {}}
                            transition={{ duration: 0.4 }}
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-smooth"
                            style={
                              isComplete || isActive
                                ? {
                                    ...activeColorStyle,
                                    color: "oklch(var(--primary-foreground))",
                                    ...(isActive
                                      ? {
                                          outline:
                                            "4px solid oklch(var(--primary) / 0.2)",
                                          outlineOffset: "2px",
                                        }
                                      : {}),
                                  }
                                : {}
                            }
                            data-pending={isPending || undefined}
                          >
                            {isPending && (
                              <span className="absolute inset-0 rounded-full bg-muted" />
                            )}
                            <span
                              className={
                                isPending
                                  ? "relative text-muted-foreground"
                                  : "relative"
                              }
                            >
                              <Icon className="w-4 h-4" />
                            </span>
                          </motion.div>
                          {i < STEPS.length - 1 && (
                            <div
                              className="w-0.5 h-10 mt-1 transition-smooth"
                              style={
                                isComplete
                                  ? activeColorStyle
                                  : { background: "oklch(var(--border))" }
                              }
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`pb-6 min-w-0 ${i === STEPS.length - 1 ? "pb-0" : ""}`}
                        >
                          <p
                            className={`font-semibold text-sm transition-smooth ${isActive ? "text-foreground" : isPending ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {step.label}
                          </p>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-xs text-muted-foreground mt-0.5"
                            >
                              {step.desc}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Delivery address */}
          <Card
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid="tracking.address_card"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">
                  Delivery Address
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
              </div>
            </div>
          </Card>

          {/* Order summary */}
          <Card
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="tracking.summary_card"
          >
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold font-display text-sm uppercase tracking-wide text-muted-foreground">
                Order Summary
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.menuItemId.toString()}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-foreground">
                    <span className="text-primary font-semibold">
                      {item.quantity.toString()}×
                    </span>{" "}
                    {item.menuItemName}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCents(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCents(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{formatCents(order.deliveryFeeCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>{formatCents(order.taxCents)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-1 border-t border-border">
                <span>Total</span>
                <span>{formatCents(order.totalCents)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
