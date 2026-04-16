import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useGetDeliveryAddresses } from "../hooks/useBackend";
import { useCart } from "../hooks/useCart";
import { formatCents } from "../types";
import type { DeliveryAddress } from "../types";

const DELIVERY_FEE_CENTS = 299;
const TAX_RATE = 0.0875;

export function CartPage() {
  const navigate = useNavigate();
  const {
    state,
    removeItem,
    updateQuantity,
    setDeliveryAddress,
    subtotalCents,
  } = useCart();
  const { data: addresses, isLoading: addressesLoading } =
    useGetDeliveryAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<bigint | null>(
    state.deliveryAddressId,
  );

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + DELIVERY_FEE_CENTS + taxCents;

  function handleAddressSelect(addr: DeliveryAddress) {
    setSelectedAddressId(addr.id);
    setDeliveryAddress(addr.id);
  }

  function handleProceedToCheckout() {
    if (selectedAddressId) {
      setDeliveryAddress(selectedAddressId);
    }
    navigate({ to: "/checkout" });
  }

  if (state.items.length === 0) {
    return (
      <Layout>
        <div
          className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4"
          data-ocid="cart.empty_state"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Add items from a restaurant to start your order.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full"
            data-ocid="cart.browse_restaurants_button"
          >
            <Link to="/">Browse Restaurants</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Your Cart
          </h1>
          <p className="text-muted-foreground mt-1">
            {state.restaurantName && (
              <span>
                Ordering from{" "}
                <span className="text-primary font-semibold">
                  {state.restaurantName}
                </span>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4" data-ocid="cart.list">
            {state.items.map((item, idx) => {
              const itemTotal =
                (Number(item.menuItem.priceCents) +
                  item.customizations.reduce(
                    (s, c) => s + Number(c.priceModifierCents),
                    0,
                  )) *
                item.quantity;

              return (
                <Card
                  key={item.menuItem.id.toString()}
                  className="p-4 animate-fade-in-up border-border"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {item.menuItem.imageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.menuItem.imageUrl}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {item.menuItem.name}
                        </h3>
                        <span className="font-semibold text-foreground flex-shrink-0">
                          {formatCents(itemTotal)}
                        </span>
                      </div>

                      {/* Customizations */}
                      {item.customizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.customizations.map((c) => (
                            <Badge
                              key={c.selectedOption}
                              variant="secondary"
                              className="text-xs"
                            >
                              {c.selectedOption}
                              {Number(c.priceModifierCents) > 0 &&
                                ` +${formatCents(c.priceModifierCents)}`}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                          {item.specialInstructions}
                        </p>
                      )}

                      {/* Quantity + Remove */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-smooth"
                            aria-label="Decrease quantity"
                            data-ocid={`cart.minus_button.${idx + 1}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-smooth text-primary-foreground"
                            aria-label="Increase quantity"
                            data-ocid={`cart.plus_button.${idx + 1}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.menuItem.id)}
                          className="ml-auto text-muted-foreground hover:text-destructive transition-smooth p-1.5 rounded-lg hover:bg-destructive/10"
                          aria-label="Remove item"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Delivery Address Selector */}
            <Card className="p-4 border-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Delivery Address
                </h3>
              </div>

              {addressesLoading ? (
                <LoadingSpinner size="sm" label="Loading addresses…" />
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-2" data-ocid="cart.address_selector">
                  {addresses.map((addr) => (
                    <button
                      type="button"
                      key={addr.id.toString()}
                      onClick={() => handleAddressSelect(addr)}
                      className={`w-full text-left p-3 rounded-xl border transition-smooth ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                      data-ocid="cart.address_option"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">
                            {addr.addressLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {addr.street}, {addr.city}, {addr.state}{" "}
                            {addr.zipCode}
                          </p>
                        </div>
                        {addr.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No saved addresses.{" "}
                  <Link to="/profile" className="text-primary underline">
                    Add one in your profile.
                  </Link>
                </p>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <Card
              className="p-5 sticky top-24 border-border shadow-elevated"
              data-ocid="cart.summary_card"
            >
              <h2 className="font-display font-bold text-lg text-foreground mb-4">
                Order Summary
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
                  <span className="text-muted-foreground">Tax</span>
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

              <Button
                size="lg"
                className="w-full rounded-full font-semibold"
                onClick={handleProceedToCheckout}
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full mt-2 text-muted-foreground"
                data-ocid="cart.continue_shopping_button"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
