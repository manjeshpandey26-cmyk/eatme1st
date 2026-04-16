import { c as createLucideIcon, h as useParams, j as jsxRuntimeExports, L as Layout, O as OrderCardSkeleton, C as ChefHat, M as MapPin, r as reactExports } from "./index-BRrb9eOw.js";
import { C as Card } from "./card-BeDGiw-l.js";
import { i as useGetOrder } from "./useBackend-BSOypR0Y.js";
import { a as formatTimestamp, f as formatCents } from "./index-CZYV8lVp.js";
import { P as Package } from "./package-CQLUJzo-.js";
import { C as Clock } from "./clock-B0R97huC.js";
import { C as CircleCheck } from "./circle-check-B6MLk9ct.js";
import { T as Truck } from "./truck-BC2q8ht0.js";
import { m as motion } from "./proxy-6bqx6Ihj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
const STEPS = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: CircleCheck,
    desc: "Restaurant received your order"
  },
  {
    key: "beingPrepared",
    label: "Being Prepared",
    icon: ChefHat,
    desc: "The kitchen is cooking your food"
  },
  {
    key: "readyForPickup",
    label: "Ready for Pickup",
    icon: Package,
    desc: "Order packed and ready"
  },
  {
    key: "driverAssigned",
    label: "Driver Assigned",
    icon: UserCheck,
    desc: "A driver is heading to the restaurant"
  },
  {
    key: "inTransit",
    label: "On the Way",
    icon: Truck,
    desc: "Your order is heading to you"
  },
  {
    key: "delivered",
    label: "Delivered!",
    icon: CircleCheck,
    desc: "Enjoy your meal!"
  }
];
const STEP_INDEX = {
  confirmed: 0,
  beingPrepared: 1,
  readyForPickup: 2,
  driverAssigned: 3,
  inTransit: 4,
  delivered: 5,
  cancelled: -1
};
const STEP_COLOR_STYLE = {
  confirmed: { background: "oklch(var(--primary))" },
  beingPrepared: { background: "oklch(var(--accent))" },
  readyForPickup: { background: "oklch(var(--primary))" },
  driverAssigned: { background: "oklch(var(--primary) / 0.8)" },
  inTransit: { background: "oklch(var(--accent) / 0.9)" },
  delivered: { background: "oklch(0.62 0.18 145)" }
};
function Countdown({ targetMs }) {
  const [remaining, setRemaining] = reactExports.useState(
    () => Math.max(0, targetMs - Date.now())
  );
  reactExports.useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(
      () => setRemaining((r) => Math.max(0, r - 1e3)),
      1e3
    );
    return () => clearInterval(id);
  }, [remaining]);
  if (remaining <= 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-semibold", children: "Arriving now!" });
  const mins = Math.floor(remaining / 6e4);
  const secs = Math.floor(remaining % 6e4 / 1e3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold tabular-nums text-primary", children: [
    mins,
    "m ",
    secs.toString().padStart(2, "0"),
    "s"
  ] });
}
function OrderTrackingPage() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const orderIdBigInt = orderId ? BigInt(orderId) : null;
  const { data: order, isLoading, isFetching } = useGetOrder(orderIdBigInt);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-xl mx-auto px-4 py-8 space-y-4",
        "data-ocid": "tracking.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCardSkeleton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCardSkeleton, {})
        ]
      }
    ) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] text-center px-4",
        "data-ocid": "tracking.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-14 h-14 text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold font-display mb-2", children: "Order not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "We couldn't find order #",
            orderId,
            "."
          ] })
        ]
      }
    ) });
  }
  const statusKey = order.status;
  const currentStep = STEP_INDEX[statusKey] ?? 0;
  const isCancelled = statusKey === "cancelled";
  const estimatedMs = Number(order.estimatedDeliveryTime) / 1e6;
  const activeColorStyle = STEP_COLOR_STYLE[statusKey] ?? {
    background: "oklch(var(--primary))"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground", children: order.restaurantName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            "Ordered ",
            formatTimestamp(order.createdAt)
          ] })
        ] }),
        isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-2 h-2 rounded-full bg-primary animate-pulse",
            title: "Live updating"
          }
        )
      ] }),
      !isCancelled && statusKey !== "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-3 border border-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Estimated arrival:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Countdown, { targetMs: estimatedMs })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto px-4 py-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "bg-card border border-border rounded-2xl overflow-hidden",
          "data-ocid": "tracking.stepper",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground font-display text-sm uppercase tracking-wide text-muted-foreground", children: "Order Progress" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5", children: isCancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 py-4",
                "data-ocid": "tracking.cancelled_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Order Cancelled" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This order was cancelled." })
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: STEPS.map((step, i) => {
              const isComplete = i < currentStep;
              const isActive = i === currentStep;
              const isPending = i > currentStep;
              const Icon = step.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex gap-4",
                  "data-ocid": `tracking.step.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          initial: isActive ? { scale: 0.8 } : false,
                          animate: isActive ? { scale: [0.8, 1.1, 1] } : {},
                          transition: { duration: 0.4 },
                          className: "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-smooth",
                          style: isComplete || isActive ? {
                            ...activeColorStyle,
                            color: "oklch(var(--primary-foreground))",
                            ...isActive ? {
                              outline: "4px solid oklch(var(--primary) / 0.2)",
                              outlineOffset: "2px"
                            } : {}
                          } : {},
                          "data-pending": isPending || void 0,
                          children: [
                            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-muted" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: isPending ? "relative text-muted-foreground" : "relative",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
                              }
                            )
                          ]
                        }
                      ),
                      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-0.5 h-10 mt-1 transition-smooth",
                          style: isComplete ? activeColorStyle : { background: "oklch(var(--border))" }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `pb-6 min-w-0 ${i === STEPS.length - 1 ? "pb-0" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: `font-semibold text-sm transition-smooth ${isActive ? "text-foreground" : isPending ? "text-muted-foreground" : "text-foreground"}`,
                              children: step.label
                            }
                          ),
                          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.p,
                            {
                              initial: { opacity: 0, height: 0 },
                              animate: { opacity: 1, height: "auto" },
                              className: "text-xs text-muted-foreground mt-0.5",
                              children: step.desc
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                step.key
              );
            }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "bg-card border border-border rounded-2xl p-5",
          "data-ocid": "tracking.address_card",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "Delivery Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                order.deliveryAddress.street,
                ", ",
                order.deliveryAddress.city,
                ",",
                " ",
                order.deliveryAddress.state,
                " ",
                order.deliveryAddress.zipCode
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "bg-card border border-border rounded-2xl overflow-hidden",
          "data-ocid": "tracking.summary_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold font-display text-sm uppercase tracking-wide text-muted-foreground", children: "Order Summary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-5 py-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                      item.quantity.toString(),
                      "×"
                    ] }),
                    " ",
                    item.menuItemName
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: formatCents(item.unitPriceCents * item.quantity) })
                ]
              },
              item.menuItemId.toString()
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 bg-muted/30 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.subtotalCents) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery Fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.deliveryFeeCents) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.taxCents) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-base font-bold text-foreground pt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.totalCents) })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] }) });
}
export {
  OrderTrackingPage
};
