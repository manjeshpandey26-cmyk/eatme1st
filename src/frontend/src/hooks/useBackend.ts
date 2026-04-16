import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  DeliveryAddress,
  MenuItem,
  Order,
  OrderStatus,
  PlaceOrderInput,
  Restaurant,
  ShoppingItem,
  UserProfile,
} from "../backend";

// Shared actor hook — pass createActor factory
export function useBackend() {
  return useActor(createActor);
}

// ── Restaurant Queries ─────────────────────────────────────────────────────

export function useListRestaurants() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRestaurants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRestaurant(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Restaurant | null>({
    queryKey: ["restaurant", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getRestaurant(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchRestaurants(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchRestaurants(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useFilterRestaurants(
  cuisine: string | null,
  minRating: number | null,
  maxDeliveryMinutes: bigint | null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Restaurant[]>({
    queryKey: [
      "restaurants",
      "filter",
      cuisine,
      minRating,
      maxDeliveryMinutes?.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterRestaurants(cuisine, minRating, maxDeliveryMinutes);
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Menu Queries ───────────────────────────────────────────────────────────

export function useGetMenuItems(restaurantId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems", restaurantId?.toString()],
    queryFn: async () => {
      if (!actor || restaurantId === null) return [];
      return actor.getMenuItems(restaurantId);
    },
    enabled: !!actor && !isFetching && restaurantId !== null,
  });
}

export function useGetMenuItem(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MenuItem | null>({
    queryKey: ["menuItem", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getMenuItem(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ── Order Queries ──────────────────────────────────────────────────────────

export function useGetOrder(orderId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order | null>({
    queryKey: ["order", orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === null) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== null,
    refetchInterval: 15_000, // poll every 15s for tracking
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order[]>({
    queryKey: ["orderHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Address Queries ────────────────────────────────────────────────────────

export function useGetDeliveryAddresses() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DeliveryAddress[]>({
    queryKey: ["deliveryAddresses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDeliveryAddresses();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Profile Queries ────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    Order,
    Error,
    { input: PlaceOrderInput; stripeSessionId: string }
  >({
    mutationFn: async ({ input, stripeSessionId }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(input, stripeSessionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor(createActor);
  return useMutation<
    string,
    Error,
    { items: ShoppingItem[]; successUrl: string; cancelUrl: string }
  >({
    mutationFn: async ({ items, successUrl, cancelUrl }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useConfirmOrderPayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Order | null, Error, string>({
    mutationFn: async (stripeSessionId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.confirmOrderPayment(stripeSessionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, { orderId: bigint; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: ["order", orderId.toString()] });
      qc.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });
}

export function useAddDeliveryAddress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    DeliveryAddress,
    Error,
    {
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
    }
  >({
    mutationFn: async ({ label, street, city, state, zipCode }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addDeliveryAddress(label, street, city, state, zipCode);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryAddresses"] });
    },
  });
}

export function useUpdateDeliveryAddress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, DeliveryAddress>({
    mutationFn: async (address) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDeliveryAddress(address);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryAddresses"] });
    },
  });
}

export function useDeleteDeliveryAddress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (addressId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteDeliveryAddress(addressId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryAddresses"] });
    },
  });
}

export function useSetDefaultDeliveryAddress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (addressId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setDefaultDeliveryAddress(addressId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryAddresses"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useGetStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.__kind__ !== "completed") return 3000;
      return false;
    },
  });
}
