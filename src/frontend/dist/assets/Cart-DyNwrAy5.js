import { c as createLucideIcon, i as useNavigate, k as useCart, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button, a as Link, b as Badge, M as MapPin, n as LoadingSpinner } from "./index-BRrb9eOw.js";
import { C as Card } from "./card-BeDGiw-l.js";
import { S as Separator } from "./separator-C1HnkiGp.js";
import { e as useGetDeliveryAddresses } from "./useBackend-BSOypR0Y.js";
import { f as formatCents } from "./index-CZYV8lVp.js";
import { S as ShoppingBag } from "./shopping-bag-Di0zXn1M.js";
import { M as Minus } from "./minus-BjOHKOCK.js";
import { P as Plus } from "./plus-CuO0gjZb.js";
import { T as Trash2 } from "./trash-2-D7Nt15Ie.js";
import "./index-DThzL3Nv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const DELIVERY_FEE_CENTS = 299;
const TAX_RATE = 0.0875;
function CartPage() {
  const navigate = useNavigate();
  const {
    state,
    removeItem,
    updateQuantity,
    setDeliveryAddress,
    subtotalCents
  } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useGetDeliveryAddresses();
  const [selectedAddressId, setSelectedAddressId] = reactExports.useState(
    state.deliveryAddressId
  );
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + DELIVERY_FEE_CENTS + taxCents;
  function handleAddressSelect(addr) {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4",
        "data-ocid": "cart.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-2", children: "Your cart is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "Add items from a restaurant to start your order." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              className: "rounded-full",
              "data-ocid": "cart.browse_restaurants_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Browse Restaurants" })
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 animate-fade-in-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Your Cart" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: state.restaurantName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Ordering from",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: state.restaurantName })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4", "data-ocid": "cart.list", children: [
        state.items.map((item, idx) => {
          const itemTotal = (Number(item.menuItem.priceCents) + item.customizations.reduce(
            (s, c) => s + Number(c.priceModifierCents),
            0
          )) * item.quantity;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "p-4 animate-fade-in-up border-border",
              style: { animationDelay: `${idx * 0.05}s` },
              "data-ocid": `cart.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                item.menuItem.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-xl overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.menuItem.imageUrl,
                    alt: item.menuItem.name,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground truncate", children: item.menuItem.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground flex-shrink-0", children: formatCents(itemTotal) })
                  ] }),
                  item.customizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: item.customizations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs",
                      children: [
                        c.selectedOption,
                        Number(c.priceModifierCents) > 0 && ` +${formatCents(c.priceModifierCents)}`
                      ]
                    },
                    c.selectedOption
                  )) }),
                  item.specialInstructions && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 italic line-clamp-1", children: item.specialInstructions }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted rounded-full p-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateQuantity(
                            item.menuItem.id,
                            item.quantity - 1
                          ),
                          className: "w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-smooth",
                          "aria-label": "Decrease quantity",
                          "data-ocid": `cart.minus_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-semibold", children: item.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateQuantity(
                            item.menuItem.id,
                            item.quantity + 1
                          ),
                          className: "w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-smooth text-primary-foreground",
                          "aria-label": "Increase quantity",
                          "data-ocid": `cart.plus_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeItem(item.menuItem.id),
                        className: "ml-auto text-muted-foreground hover:text-destructive transition-smooth p-1.5 rounded-lg hover:bg-destructive/10",
                        "aria-label": "Remove item",
                        "data-ocid": `cart.delete_button.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ] })
                ] })
              ] })
            },
            item.menuItem.id.toString()
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Delivery Address" })
          ] }),
          addressesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm", label: "Loading addresses…" }) : addresses && addresses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "cart.address_selector", children: addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleAddressSelect(addr),
              className: `w-full text-left p-3 rounded-xl border transition-smooth ${selectedAddressId === addr.id ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card hover:border-primary/40"}`,
              "data-ocid": "cart.address_option",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: addr.addressLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    addr.street,
                    ", ",
                    addr.city,
                    ", ",
                    addr.state,
                    " ",
                    addr.zipCode
                  ] })
                ] }),
                addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Default" })
              ] })
            },
            addr.id.toString()
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "No saved addresses.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "text-primary underline", children: "Add one in your profile." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:w-80 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "p-5 sticky top-24 border-border shadow-elevated",
          "data-ocid": "cart.summary_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground mb-4", children: "Order Summary" }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatCents(taxCents) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xl text-foreground", children: formatCents(totalCents) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "w-full rounded-full font-semibold",
                onClick: handleProceedToCheckout,
                "data-ocid": "cart.checkout_button",
                children: [
                  "Proceed to Checkout",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                asChild: true,
                className: "w-full mt-2 text-muted-foreground",
                "data-ocid": "cart.continue_shopping_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Continue Shopping" })
              }
            )
          ]
        }
      ) })
    ] })
  ] }) });
}
export {
  CartPage
};
