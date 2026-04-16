import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, o as cva, i as useNavigate, k as useCart, r as reactExports, L as Layout, b as Badge, M as MapPin, B as Button } from "./index-BRrb9eOw.js";
import { C as Card } from "./card-BeDGiw-l.js";
import { S as Separator } from "./separator-C1HnkiGp.js";
import { S as Skeleton } from "./skeleton-BbOdawQY.js";
import { e as useGetDeliveryAddresses, f as useCreateCheckoutSession } from "./useBackend-BSOypR0Y.js";
import { f as formatCents } from "./index-CZYV8lVp.js";
import { C as ChevronLeft } from "./chevron-left-CnsACyYI.js";
import { S as ShoppingBag } from "./shopping-bag-Di0zXn1M.js";
import "./index-DThzL3Nv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode);
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      ),
      ...props
    }
  );
}
const DELIVERY_FEE_CENTS = 299;
const TAX_RATE = 0.0875;
function CheckoutPage() {
  const navigate = useNavigate();
  const { state, subtotalCents } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useGetDeliveryAddresses();
  const createCheckoutSession = useCreateCheckoutSession();
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + DELIVERY_FEE_CENTS + taxCents;
  const selectedAddress = (addresses == null ? void 0 : addresses.find((a) => a.id === state.deliveryAddressId)) ?? (addresses == null ? void 0 : addresses[0]) ?? null;
  reactExports.useEffect(() => {
    if (state.items.length === 0) {
      navigate({ to: "/cart" });
    }
  }, [state.items.length, navigate]);
  async function handlePlaceOrder() {
    setErrorMsg(null);
    const shoppingItems = state.items.map((item) => {
      const unitPriceCents = Number(item.menuItem.priceCents) + item.customizations.reduce(
        (s, c) => s + Number(c.priceModifierCents),
        0
      );
      const customizationLabels = item.customizations.map((c) => c.selectedOption).join(", ");
      return {
        productName: item.menuItem.name,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: BigInt(unitPriceCents),
        productDescription: customizationLabels || item.menuItem.description
      };
    });
    const successUrl = `${window.location.origin}/order-confirmation/pending?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/cart`;
    try {
      const url = await createCheckoutSession.mutateAsync({
        items: shoppingItems,
        successUrl,
        cancelUrl
      });
      window.location.href = url;
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to start checkout. Please try again."
      );
    }
  }
  if (state.items.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/cart" }),
          className: "flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth mb-4 text-sm",
          "data-ocid": "checkout.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
            "Back to cart"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Review your order before placing it" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "p-5 border-border animate-fade-in-up",
            "data-ocid": "checkout.order_items_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-foreground", children: [
                  "Order from ",
                  state.restaurantName
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: state.items.map((item, idx) => {
                const unitTotal = Number(item.menuItem.priceCents) + item.customizations.reduce(
                  (s, c) => s + Number(c.priceModifierCents),
                  0
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex gap-3",
                    "data-ocid": `checkout.order_item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold text-foreground", children: item.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground truncate", children: item.menuItem.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm flex-shrink-0", children: formatCents(unitTotal * item.quantity) })
                        ] }),
                        item.customizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: item.customizations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-xs",
                            children: c.selectedOption
                          },
                          c.selectedOption
                        )) }),
                        item.specialInstructions && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 italic", children: item.specialInstructions })
                      ] })
                    ]
                  },
                  item.menuItem.id.toString()
                );
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "p-5 border-border animate-fade-in-up delay-100",
            "data-ocid": "checkout.address_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Delivery Address" })
              ] }),
              addressesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" })
              ] }) : selectedAddress ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-muted/50 p-3 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: selectedAddress.addressLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: selectedAddress.street }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    selectedAddress.city,
                    ", ",
                    selectedAddress.state,
                    " ",
                    selectedAddress.zipCode
                  ] })
                ] }),
                selectedAddress.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Default" })
              ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No delivery address selected. Go back to cart to select one." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "p-5 border-border animate-fade-in-up delay-200",
            "data-ocid": "checkout.payment_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Payment" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/50 p-3 border border-border flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-7 rounded bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Secure payment via Stripe" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You'll be redirected to enter your card details" })
                ] })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:w-80 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "p-5 sticky top-24 border-border shadow-elevated",
          "data-ocid": "checkout.summary_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground mb-4", children: "Price Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatCents(subtotalCents) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Delivery fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatCents(DELIVERY_FEE_CENTS) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax (8.75%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatCents(taxCents) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xl text-foreground", children: formatCents(totalCents) })
            ] }),
            errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Alert,
              {
                variant: "destructive",
                className: "mb-4",
                "data-ocid": "checkout.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: errorMsg })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                className: "w-full rounded-full font-semibold",
                onClick: handlePlaceOrder,
                disabled: createCheckoutSession.isPending || !selectedAddress,
                "data-ocid": "checkout.place_order_button",
                children: createCheckoutSession.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }),
                  "Redirecting…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 mr-2" }),
                  "Pay ",
                  formatCents(totalCents)
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-3", children: "Secured by Stripe. Your card info is never stored on our servers." })
          ]
        }
      ) })
    ] })
  ] }) });
}
export {
  CheckoutPage
};
