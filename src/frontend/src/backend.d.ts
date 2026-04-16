import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Cuisine = string;
export interface DeliveryAddressSnapshot {
    street: string;
    city: string;
    zipCode: string;
    state: string;
}
export type RestaurantId = bigint;
export type MenuItemId = bigint;
export type AddressId = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CustomizationOption {
    name: string;
    priceModifierCents: bigint;
}
export interface CustomizationGroup {
    name: string;
    required: boolean;
    maxSelections: bigint;
    options: Array<CustomizationOption>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface DeliveryAddress {
    id: AddressId;
    street: string;
    city: string;
    zipCode: string;
    state: string;
    addressLabel: string;
    isDefault: boolean;
}
export interface PlaceOrderInput {
    restaurantId: RestaurantId;
    items: Array<CartItemInput>;
    deliveryAddressId: AddressId;
}
export interface Restaurant {
    id: RestaurantId;
    name: string;
    isOpen: boolean;
    deliveryTimeMinutes: bigint;
    deliveryFeecents: bigint;
    imageUrl: string;
    cuisine: Cuisine;
    rating: number;
}
export interface Order {
    id: OrderId;
    subtotalCents: bigint;
    status: OrderStatus;
    deliveryAddress: DeliveryAddressSnapshot;
    deliveryFeeCents: bigint;
    createdAt: Timestamp;
    totalCents: bigint;
    estimatedDeliveryTime: Timestamp;
    restaurantId: RestaurantId;
    taxCents: bigint;
    updatedAt: Timestamp;
    restaurantName: string;
    customerId: UserId;
    items: Array<CartItem>;
    stripeSessionId: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface MenuItem {
    id: MenuItemId;
    name: string;
    isAvailable: boolean;
    description: string;
    customizations: Array<CustomizationGroup>;
    restaurantId: RestaurantId;
    imageUrl: string;
    category: string;
    priceCents: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface SelectedCustomization {
    priceModifierCents: bigint;
    selectedOption: string;
    groupName: string;
}
export interface CartItemInput {
    customizations: Array<SelectedCustomization>;
    specialInstructions: string;
    quantity: bigint;
    menuItemId: MenuItemId;
}
export interface CartItem {
    unitPriceCents: bigint;
    menuItemName: string;
    customizations: Array<SelectedCustomization>;
    specialInstructions: string;
    quantity: bigint;
    menuItemId: MenuItemId;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export type OrderId = bigint;
export enum OrderStatus {
    readyForPickup = "readyForPickup",
    cancelled = "cancelled",
    driverAssigned = "driverAssigned",
    inTransit = "inTransit",
    beingPrepared = "beingPrepared",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDeliveryAddress(addressLabel: string, street: string, city: string, state: string, zipCode: string): Promise<DeliveryAddress>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmOrderPayment(stripeSessionId: string): Promise<Order | null>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteDeliveryAddress(addressId: AddressId): Promise<void>;
    deleteMenuItem(id: MenuItemId): Promise<void>;
    deleteRestaurant(id: RestaurantId): Promise<void>;
    filterRestaurants(cuisine: string | null, minRating: number | null, maxDeliveryMinutes: bigint | null): Promise<Array<Restaurant>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeliveryAddresses(): Promise<Array<DeliveryAddress>>;
    getMenuItem(id: MenuItemId): Promise<MenuItem | null>;
    getMenuItems(restaurantId: RestaurantId): Promise<Array<MenuItem>>;
    getOrder(orderId: OrderId): Promise<Order | null>;
    getOrderHistory(): Promise<Array<Order>>;
    getRestaurant(id: RestaurantId): Promise<Restaurant | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listRestaurants(): Promise<Array<Restaurant>>;
    placeOrder(input: PlaceOrderInput, stripeSessionId: string): Promise<Order>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchRestaurants(searchQuery: string): Promise<Array<Restaurant>>;
    setDefaultDeliveryAddress(addressId: AddressId): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateDeliveryAddress(address: DeliveryAddress): Promise<void>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
    upsertMenuItem(item: MenuItem): Promise<MenuItem>;
    upsertRestaurant(restaurant: Restaurant): Promise<Restaurant>;
}
