import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ReceiptText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { useConfirmOrderPayment } from "../hooks/useBackend";
import { useCart } from "../hooks/useCart";
import { ORDER_STATUS_CONFIG, formatCents, formatTimestamp } from "../types";
import type { Order, OrderStatusKey } from "../types";

function OrderSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      <Card className="p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    </div>
  );
}

export function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  // session_id comes from Stripe's return URL as a query param
  const search = useSearch({ strict: false }) as { session_id?: string };
  const sessionId = search.session_id ?? null;

  const confirmPayment = useConfirmOrderPayment();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const confirmed = useRef(false);

  const confirmPaymentMutate = confirmPayment.mutateAsync;

  useEffect(() => {
    if (confirmed.current) return;
    confirmed.current = true;

    async function confirm() {
      try {
        if (sessionId) {
          // Stripe returned — confirm the payment and get the order
          const result = await confirmPaymentMutate(sessionId);
          if (result) {
            setOrder(result);
            clearCart();
          } else {
            setError("Payment confirmation pending. Check your orders page.");
          }
        } else {
          setError("No payment session found.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to confirm payment.",
        );
      }
    }

    confirm();
  }, [sessionId, confirmPaymentMutate, clearCart]);

  const displayOrderId = order
    ? order.id.toString()
    : orderId !== "pending"
      ? orderId
      : null;

  if (confirmPayment.isPending) {
    return (
      <Layout>
        <OrderSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto px-4 py-16 text-center"
          data-ocid="order_confirmation.error_state"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ReceiptText className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              asChild
              variant="outline"
              data-ocid="order_confirmation.view_orders_button"
            >
              <Link to="/orders">View My Orders</Link>
            </Button>
            <Button asChild data-ocid="order_confirmation.home_button">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusKey = order ? (order.status as unknown as OrderStatusKey) : null;
  const statusConfig = statusKey ? ORDER_STATUS_CONFIG[statusKey] : null;
  const estimatedDelivery = order
    ? new Date(Date.now() + 35 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Success Header */}
        <div
          className="text-center mb-8 animate-fade-in-up"
          data-ocid="order_confirmation.success_state"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your order. We're getting it ready for you.
          </p>
          {displayOrderId && (
            <div className="mt-3 inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
              <span className="text-sm text-muted-foreground">Order #</span>
              <span
                className="text-sm font-bold text-foreground"
                data-ocid="order_confirmation.order_number"
              >
                {displayOrderId}
              </span>
            </div>
          )}
        </div>

        {/* Status + ETA */}
        {order && statusConfig && (
          <Card
            className="p-5 mb-4 border-border animate-fade-in-up delay-100"
            data-ocid="order_confirmation.status_card"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Order Status
                  </p>
                  <span className={statusConfig.className}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              {estimatedDelivery && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Est. arrival by {estimatedDelivery}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Receipt Summary */}
        {order && (
          <Card
            className="p-5 mb-4 border-border animate-fade-in-up delay-200"
            data-ocid="order_confirmation.receipt_card"
          >
            <div className="flex items-center gap-2 mb-4">
              <ReceiptText className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground">
                Receipt
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatTimestamp(order.createdAt)}
              </span>
            </div>

            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.menuItemId.toString()}-${idx}`}
                  className="flex items-start gap-3"
                  data-ocid={`order_confirmation.receipt_item.${idx + 1}`}
                >
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0 mt-0.5">
                    {Number(item.quantity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.menuItemName}
                      </span>
                      <span className="text-sm font-semibold flex-shrink-0">
                        {formatCents(
                          Number(item.unitPriceCents) * Number(item.quantity),
                        )}
                      </span>
                    </div>
                    {item.customizations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {item.customizations.map((c) => (
                          <Badge
                            key={c.selectedOption}
                            variant="secondary"
                            className="text-xs"
                          >
                            {c.selectedOption}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCents(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span>{formatCents(order.deliveryFeeCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCents(order.taxCents)}</span>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-foreground">
                Total
              </span>
              <span className="font-display font-bold text-lg text-foreground">
                {formatCents(order.totalCents)}
              </span>
            </div>
          </Card>
        )}

        {/* Delivery Address on Order */}
        {order?.deliveryAddress && (
          <Card
            className="p-5 mb-6 border-border animate-fade-in-up delay-300"
            data-ocid="order_confirmation.address_card"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                Delivering to
              </h2>
            </div>
            <p className="text-sm text-foreground font-medium">
              {order.deliveryAddress.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
              {order.deliveryAddress.zipCode}
            </p>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
          {displayOrderId && displayOrderId !== "pending" && (
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-full font-semibold"
              data-ocid="order_confirmation.track_order_button"
            >
              <Link to="/orders/$orderId" params={{ orderId: displayOrderId }}>
                Track My Order
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 rounded-full"
            data-ocid="order_confirmation.browse_more_button"
          >
            <Link to="/">Order More Food</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
