import { c as createLucideIcon, j as jsxRuntimeExports, L as Layout, O as OrderCardSkeleton, i as useNavigate, B as Button } from "./index-BRrb9eOw.js";
import { C as Card } from "./card-BeDGiw-l.js";
import { h as useGetOrderHistory } from "./useBackend-BSOypR0Y.js";
import { a as formatTimestamp, f as formatCents, O as ORDER_STATUS_CONFIG } from "./index-CZYV8lVp.js";
import { P as Package } from "./package-CQLUJzo-.js";
import { m as motion } from "./proxy-6bqx6Ihj.js";
import { S as ShoppingBag } from "./shopping-bag-Di0zXn1M.js";
import { C as Clock } from "./clock-B0R97huC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function StatusBadge({ status }) {
  const key = status;
  const config = ORDER_STATUS_CONFIG[key] ?? ORDER_STATUS_CONFIG.confirmed;
  const colorStyle = (() => {
    switch (key) {
      case "confirmed":
        return {
          background: "oklch(var(--primary) / 0.12)",
          color: "oklch(var(--primary))",
          borderColor: "oklch(var(--primary) / 0.3)"
        };
      case "beingPrepared":
        return {
          background: "oklch(var(--accent) / 0.12)",
          color: "oklch(var(--accent))",
          borderColor: "oklch(var(--accent) / 0.3)"
        };
      case "readyForPickup":
        return {
          background: "oklch(var(--primary) / 0.1)",
          color: "oklch(var(--primary))",
          borderColor: "oklch(var(--primary) / 0.25)"
        };
      case "driverAssigned":
        return {
          background: "oklch(var(--primary) / 0.08)",
          color: "oklch(var(--primary) / 0.9)",
          borderColor: "oklch(var(--primary) / 0.2)"
        };
      case "inTransit":
        return {
          background: "oklch(var(--accent) / 0.1)",
          color: "oklch(var(--accent) / 0.9)",
          borderColor: "oklch(var(--accent) / 0.25)"
        };
      case "delivered":
        return {
          background: "oklch(0.62 0.18 145 / 0.12)",
          color: "oklch(0.45 0.18 145)",
          borderColor: "oklch(0.62 0.18 145 / 0.3)"
        };
      default:
        return {};
    }
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
      style: key === "cancelled" ? {} : colorStyle,
      "data-ocid": "order.status_badge",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-current opacity-70" }),
        config.label
      ]
    }
  );
}
function OrderCard({ order, index }) {
  const navigate = useNavigate();
  const itemCount = order.items.reduce((sum, i) => sum + Number(i.quantity), 0);
  const itemSummary = order.items.slice(0, 3).map(
    (i) => `${i.menuItemName}${Number(i.quantity) > 1 ? ` ×${i.quantity}` : ""}`
  ).join(", ");
  const hasMore = order.items.length > 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-smooth group",
          onClick: () => navigate({
            to: "/orders/$orderId",
            params: { orderId: order.id.toString() }
          }),
          "data-ocid": `orders.item.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground truncate font-display text-base group-hover:text-primary transition-colors", children: order.restaurantName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                    formatTimestamp(order.createdAt)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pl-13", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground line-clamp-1", children: [
                itemSummary,
                hasMore && ` +${order.items.length - 3} more`
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                    itemCount,
                    " item",
                    itemCount !== 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatCents(order.totalCents) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "gap-1.5 text-xs font-medium h-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth",
                    onClick: (e) => {
                      e.stopPropagation();
                      navigate({ to: `/restaurants/${order.restaurantId}` });
                    },
                    "data-ocid": `orders.reorder_button.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" }),
                      "Reorder"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function EmptyOrders() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "orders.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold font-display text-foreground mb-2", children: "No orders yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Your order history will appear here once you place your first order." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate({ to: "/" }),
            className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6",
            "data-ocid": "orders.browse_button",
            children: "Browse Restaurants"
          }
        )
      ]
    }
  );
}
function OrdersPage() {
  const { data: orders, isLoading } = useGetOrderHistory();
  const sorted = orders ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Your Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: sorted.length > 0 ? `${sorted.length} order${sorted.length !== 1 ? "s" : ""} total` : "Track and reorder your favorites" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", "data-ocid": "orders.list", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "orders.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCardSkeleton, {}, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyOrders, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: sorted.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order, index: i }, order.id.toString())) }) })
  ] }) });
}
export {
  OrdersPage
};
