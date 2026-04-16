import { c as createLucideIcon, h as useParams, p as useSearch, k as useCart, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button, a as Link, b as Badge, M as MapPin } from "./index-BRrb9eOw.js";
import { C as Card } from "./card-BeDGiw-l.js";
import { S as Separator } from "./separator-C1HnkiGp.js";
import { S as Skeleton } from "./skeleton-BbOdawQY.js";
import { g as useConfirmOrderPayment } from "./useBackend-BSOypR0Y.js";
import { O as ORDER_STATUS_CONFIG, a as formatTimestamp, f as formatCents } from "./index-CZYV8lVp.js";
import { C as CircleCheck } from "./circle-check-B6MLk9ct.js";
import { P as Package } from "./package-CQLUJzo-.js";
import { C as Clock } from "./clock-B0R97huC.js";
import "./index-DThzL3Nv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M14 8H8", key: "1l3xfs" }],
  ["path", { d: "M16 12H8", key: "1fr5h0" }],
  ["path", { d: "M13 16H8", key: "wsln4y" }]
];
const ReceiptText = createLucideIcon("receipt-text", __iconNode);
function OrderSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-12 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 mx-auto" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" })
    ] })
  ] });
}
function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const search = useSearch({ strict: false });
  const sessionId = search.session_id ?? null;
  const confirmPayment = useConfirmOrderPayment();
  const { clearCart } = useCart();
  const [order, setOrder] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const confirmed = reactExports.useRef(false);
  const confirmPaymentMutate = confirmPayment.mutateAsync;
  reactExports.useEffect(() => {
    if (confirmed.current) return;
    confirmed.current = true;
    async function confirm() {
      try {
        if (sessionId) {
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
          err instanceof Error ? err.message : "Failed to confirm payment."
        );
      }
    }
    confirm();
  }, [sessionId, confirmPaymentMutate, clearCart]);
  const displayOrderId = order ? order.id.toString() : orderId !== "pending" ? orderId : null;
  if (confirmPayment.isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderSkeleton, {}) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto px-4 py-16 text-center",
        "data-ocid": "order_confirmation.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "w-8 h-8 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground mb-2", children: "Something went wrong" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                variant: "outline",
                "data-ocid": "order_confirmation.view_orders_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", children: "View My Orders" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "order_confirmation.home_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back to Home" }) })
          ] })
        ]
      }
    ) });
  }
  const statusKey = order ? order.status : null;
  const statusConfig = statusKey ? ORDER_STATUS_CONFIG[statusKey] : null;
  const estimatedDelivery = order ? new Date(Date.now() + 35 * 60 * 1e3).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center mb-8 animate-fade-in-up",
        "data-ocid": "order_confirmation.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground mb-2", children: "Order Confirmed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Thank you for your order. We're getting it ready for you." }),
          displayOrderId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Order #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm font-bold text-foreground",
                "data-ocid": "order_confirmation.order_number",
                children: displayOrderId
              }
            )
          ] })
        ]
      }
    ),
    order && statusConfig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "p-5 mb-4 border-border animate-fade-in-up delay-100",
        "data-ocid": "order_confirmation.status_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Order Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusConfig.className, children: statusConfig.label })
            ] })
          ] }),
          estimatedDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Est. arrival by ",
              estimatedDelivery
            ] })
          ] })
        ] })
      }
    ),
    order && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "p-5 mb-4 border-border animate-fade-in-up delay-200",
        "data-ocid": "order_confirmation.receipt_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Receipt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: formatTimestamp(order.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: order.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3",
              "data-ocid": `order_confirmation.receipt_item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0 mt-0.5", children: Number(item.quantity) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: item.menuItemName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold flex-shrink-0", children: formatCents(
                      Number(item.unitPriceCents) * Number(item.quantity)
                    ) })
                  ] }),
                  item.customizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-0.5", children: item.customizations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs",
                      children: c.selectedOption
                    },
                    c.selectedOption
                  )) })
                ] })
              ]
            },
            `${item.menuItemId.toString()}-${idx}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.subtotalCents) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Delivery fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.deliveryFeeCents) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCents(order.taxCents) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: formatCents(order.totalCents) })
          ] })
        ]
      }
    ),
    (order == null ? void 0 : order.deliveryAddress) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "p-5 mb-6 border-border animate-fade-in-up delay-300",
        "data-ocid": "order_confirmation.address_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm", children: "Delivering to" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: order.deliveryAddress.street }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            order.deliveryAddress.city,
            ", ",
            order.deliveryAddress.state,
            " ",
            order.deliveryAddress.zipCode
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300", children: [
      displayOrderId && displayOrderId !== "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          size: "lg",
          className: "flex-1 rounded-full font-semibold",
          "data-ocid": "order_confirmation.track_order_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders/$orderId", params: { orderId: displayOrderId }, children: "Track My Order" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          variant: "outline",
          size: "lg",
          className: "flex-1 rounded-full",
          "data-ocid": "order_confirmation.browse_more_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Order More Food" })
        }
      )
    ] })
  ] }) });
}
export {
  OrderConfirmationPage
};
