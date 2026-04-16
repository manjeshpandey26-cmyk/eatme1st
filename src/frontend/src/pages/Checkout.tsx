import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
  useCreateCheckoutSession,
  useGetDeliveryAddresses,
} from "../hooks/useBackend";
import { useCart } from "../hooks/useCart";
import { formatCents } from "../types";
import type { ShoppingItem } from "../types";

const DELIVERY_FEE_CENTS = 299;
const TAX_RATE = 0.0875;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state, subtotalCents } = useCart();
  const { data: addresses, isLoading: addressesLoading } =
    useGetDeliveryAddresses();
  const createCheckoutSession = useCreateCheckoutSession();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + DELIVERY_FEE_CENTS + taxCents;

  const selectedAddress =
    addresses?.find((a) => a.id === state.deliveryAddressId) ??
    addresses?.[0] ??
    null;

  // Redirect to cart if empty
  useEffect(() => {
    if (state.items.length === 0) {
      navigate({ to: "/cart" });
    }
  }, [state.items.length, navigate]);

  async function handlePlaceOrder() {
    setErrorMsg(null);

    const shoppingItems: ShoppingItem[] = state.items.map((item) => {
      const unitPriceCents =
        Number(item.menuItem.priceCents) +
        item.customizations.reduce(
          (s, c) => s + Number(c.priceModifierCents),
          0,
        );
      const customizationLabels = item.customizations
        .map((c) => c.selectedOption)
        .join(", ");
      return {
        productName: item.menuItem.name,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: BigInt(unitPriceCents),
        productDescription: customizationLabels || item.menuItem.description,
      };
    });

    const successUrl = `${window.location.origin}/order-confirmation/pending?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/cart`;

    try {
      const url = await createCheckoutSession.mutateAsync({
        items: shoppingItems,
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to start checkout. Please try again.",
      );
    }
  }

  if (state.items.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <button
            type="button"
            onClick={() => navigate({ to: "/cart" })}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth mb-4 text-sm"
            data-ocid="checkout.back_button"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to cart
          </button>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Checkout
          </h1>
          <p className="text-muted-foreground mt-1">
            Review your order before placing it
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Order Review */}
          <div className="flex-1 space-y-5">
            {/* Order Items */}
            <Card
              className="p-5 border-border animate-fade-in-up"
              data-ocid="checkout.order_items_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-foreground">
                  Order from {state.restaurantName}
                </h2>
              </div>

              <div className="space-y-3">
                {state.items.map((item, idx) => {
                  const unitTotal =
                    Number(item.menuItem.priceCents) +
                    item.customizations.reduce(
                      (s, c) => s + Number(c.priceModifierCents),
                      0,
                    );
                  return (
                    <div
                      key={item.menuItem.id.toString()}
                      className="flex gap-3"
                      data-ocid={`checkout.order_item.${idx + 1}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold text-foreground">
                        {item.quantity}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {item.menuItem.name}
                          </span>
                          <span className="font-semibold text-sm flex-shrink-0">
                            {formatCents(unitTotal * item.quantity)}
                          </span>
                        </div>
                        {item.customizations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
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
                        {item.specialInstructions && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">
                            {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Delivery Address */}
            <Card
              className="p-5 border-border animate-fade-in-up delay-100"
              data-ocid="checkout.address_card"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-foreground">
                  Delivery Address
                </h2>
              </div>

              {addressesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : selectedAddress ? (
                <div className="rounded-xl bg-muted/50 p-3 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {selectedAddress.addressLabel}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedAddress.street}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.zipCode}
                      </p>
                    </div>
                    {selectedAddress.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No delivery address selected. Go back to cart to select one.
                </p>
              )}
            </Card>

            {/* Payment Method */}
            <Card
              className="p-5 border-border animate-fade-in-up delay-200"
              data-ocid="checkout.payment_card"
            >
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-foreground">
                  Payment
                </h2>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 border border-border flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-card border border-border flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Secure payment via Stripe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You'll be redirected to enter your card details
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Summary + Place Order */}
          <div className="lg:w-80 flex-shrink-0">
            <Card
              className="p-5 sticky top-24 border-border shadow-elevated"
              data-ocid="checkout.summary_card"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-4">
                Price Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatCents(subtotalCents)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span className="font-medium">
                    {formatCents(DELIVERY_FEE_CENTS)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8.75%)</span>
                  <span className="font-medium">{formatCents(taxCents)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-display font-bold text-foreground">
                  Total
                </span>
                <span className="font-display font-bold text-xl text-foreground">
                  {formatCents(totalCents)}
                </span>
              </div>

              {errorMsg && (
                <Alert
                  variant="destructive"
                  className="mb-4"
                  data-ocid="checkout.error_state"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

              <Button
                size="lg"
                className="w-full rounded-full font-semibold"
                onClick={handlePlaceOrder}
                disabled={createCheckoutSession.isPending || !selectedAddress}
                data-ocid="checkout.place_order_button"
              >
                {createCheckoutSession.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Redirecting…
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay {formatCents(totalCents)}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Secured by Stripe. Your card info is never stored on our
                servers.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
