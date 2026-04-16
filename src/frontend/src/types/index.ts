// Re-export backend types from the implementation file
export type {
  Restaurant,
  MenuItem,
  CartItem,
  CartItemInput,
  Order,
  DeliveryAddress,
  DeliveryAddressSnapshot,
  UserProfile,
  SelectedCustomization,
  CustomizationGroup,
  CustomizationOption,
  ShoppingItem,
  PlaceOrderInput,
  RestaurantId,
  MenuItemId,
  AddressId,
  OrderId,
  UserId,
  Timestamp,
} from "../backend";
export { OrderStatus, UserRole } from "../backend";

// Frontend-only cart item type (menu item + quantity + customizations)
export interface CartMenuItem {
  menuItem: import("../backend").MenuItem;
  quantity: number;
  customizations: import("../backend").SelectedCustomization[];
  specialInstructions: string;
}

// Cart state
export interface CartState {
  items: CartMenuItem[];
  restaurantId: bigint | null;
  restaurantName: string;
  deliveryAddressId: bigint | null;
}

// Order status display helpers
export type OrderStatusKey =
  | "confirmed"
  | "beingPrepared"
  | "readyForPickup"
  | "driverAssigned"
  | "inTransit"
  | "delivered"
  | "cancelled";

export interface StatusConfig {
  label: string;
  className: string;
  step: number;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatusKey, StatusConfig> = {
  confirmed: {
    label: "Order Confirmed",
    className: "badge-status-confirmed",
    step: 1,
  },
  beingPrepared: {
    label: "Being Prepared",
    className: "badge-status-preparing",
    step: 2,
  },
  readyForPickup: {
    label: "Ready for Pickup",
    className: "badge-status-ready",
    step: 3,
  },
  driverAssigned: {
    label: "Driver Assigned",
    className: "badge-status-intransit",
    step: 4,
  },
  inTransit: {
    label: "On the Way",
    className: "badge-status-intransit",
    step: 5,
  },
  delivered: {
    label: "Delivered",
    className: "badge-status-delivered",
    step: 6,
  },
  cancelled: {
    label: "Cancelled",
    className: "badge-status-confirmed",
    step: 0,
  },
};

// Utility: format cents to dollar string
export function formatCents(cents: bigint | number): string {
  const n = typeof cents === "bigint" ? Number(cents) : cents;
  return `$${(n / 100).toFixed(2)}`;
}

// Utility: format timestamp to readable date
export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000; // nanoseconds to milliseconds
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
