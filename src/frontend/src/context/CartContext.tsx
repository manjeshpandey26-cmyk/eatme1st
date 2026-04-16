import { type ReactNode, createContext, useContext, useReducer } from "react";
import type { MenuItem, SelectedCustomization } from "../backend";
import type { CartMenuItem, CartState } from "../types";

// Actions
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        menuItem: MenuItem;
        quantity: number;
        customizations: SelectedCustomization[];
        specialInstructions: string;
        restaurantId: bigint;
        restaurantName: string;
      };
    }
  | { type: "REMOVE_ITEM"; payload: { menuItemId: bigint } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { menuItemId: bigint; quantity: number };
    }
  | { type: "SET_DELIVERY_ADDRESS"; payload: { addressId: bigint } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: "",
  deliveryAddressId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const {
        menuItem,
        quantity,
        customizations,
        specialInstructions,
        restaurantId,
        restaurantName,
      } = action.payload;
      // If adding from a different restaurant, clear first
      if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
        return {
          items: [{ menuItem, quantity, customizations, specialInstructions }],
          restaurantId,
          restaurantName,
          deliveryAddressId: state.deliveryAddressId,
        };
      }
      const existingIndex = state.items.findIndex(
        (i) => i.menuItem.id === menuItem.id,
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        restaurantId,
        restaurantName,
        items: [
          ...state.items,
          { menuItem, quantity, customizations, specialInstructions },
        ],
      };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) => i.menuItem.id !== action.payload.menuItemId,
      );
      return {
        ...state,
        items,
        restaurantId: items.length === 0 ? null : state.restaurantId,
        restaurantName: items.length === 0 ? "" : state.restaurantName,
      };
    }
    case "UPDATE_QUANTITY": {
      const { menuItemId, quantity } = action.payload;
      if (quantity <= 0) {
        const items = state.items.filter((i) => i.menuItem.id !== menuItemId);
        return {
          ...state,
          items,
          restaurantId: items.length === 0 ? null : state.restaurantId,
          restaurantName: items.length === 0 ? "" : state.restaurantName,
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i,
        ),
      };
    }
    case "SET_DELIVERY_ADDRESS":
      return { ...state, deliveryAddressId: action.payload.addressId };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

// Context
interface CartContextValue {
  state: CartState;
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions: string,
    restaurantId: bigint,
    restaurantName: string,
  ) => void;
  removeItem: (menuItemId: bigint) => void;
  updateQuantity: (menuItemId: bigint, quantity: number) => void;
  setDeliveryAddress: (addressId: bigint) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = state.items.reduce((sum, i) => {
    const base = Number(i.menuItem.priceCents) * i.quantity;
    const extras = i.customizations.reduce(
      (s, c) => s + Number(c.priceModifierCents) * i.quantity,
      0,
    );
    return sum + base + extras;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (
          menuItem,
          quantity,
          customizations,
          specialInstructions,
          restaurantId,
          restaurantName,
        ) =>
          dispatch({
            type: "ADD_ITEM",
            payload: {
              menuItem,
              quantity,
              customizations,
              specialInstructions,
              restaurantId,
              restaurantName,
            },
          }),
        removeItem: (menuItemId) =>
          dispatch({ type: "REMOVE_ITEM", payload: { menuItemId } }),
        updateQuantity: (menuItemId, quantity) =>
          dispatch({
            type: "UPDATE_QUANTITY",
            payload: { menuItemId, quantity },
          }),
        setDeliveryAddress: (addressId) =>
          dispatch({ type: "SET_DELIVERY_ADDRESS", payload: { addressId } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        itemCount,
        subtotalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}

// Export CartMenuItem type used by consumers
export type { CartMenuItem };
