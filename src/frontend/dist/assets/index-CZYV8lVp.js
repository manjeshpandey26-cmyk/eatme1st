import "./useBackend-BSOypR0Y.js";
const ORDER_STATUS_CONFIG = {
  confirmed: {
    label: "Order Confirmed",
    className: "badge-status-confirmed",
    step: 1
  },
  beingPrepared: {
    label: "Being Prepared",
    className: "badge-status-preparing",
    step: 2
  },
  readyForPickup: {
    label: "Ready for Pickup",
    className: "badge-status-ready",
    step: 3
  },
  driverAssigned: {
    label: "Driver Assigned",
    className: "badge-status-intransit",
    step: 4
  },
  inTransit: {
    label: "On the Way",
    className: "badge-status-intransit",
    step: 5
  },
  delivered: {
    label: "Delivered",
    className: "badge-status-delivered",
    step: 6
  },
  cancelled: {
    label: "Cancelled",
    className: "badge-status-confirmed",
    step: 0
  }
};
function formatCents(cents) {
  const n = typeof cents === "bigint" ? Number(cents) : cents;
  return `$${(n / 100).toFixed(2)}`;
}
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
export {
  ORDER_STATUS_CONFIG as O,
  formatTimestamp as a,
  formatCents as f
};
