import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { CartProvider } from "./context/CartContext";
import { NotFoundPage } from "./pages/NotFound";

// Lazy-loaded pages
const HomePage = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.HomePage })),
);
const RestaurantPage = lazy(() =>
  import("./pages/Restaurant").then((m) => ({ default: m.RestaurantPage })),
);
const CartPage = lazy(() =>
  import("./pages/Cart").then((m) => ({ default: m.CartPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/Checkout").then((m) => ({ default: m.CheckoutPage })),
);
const OrderConfirmationPage = lazy(() =>
  import("./pages/OrderConfirmation").then((m) => ({
    default: m.OrderConfirmationPage,
  })),
);
const OrdersPage = lazy(() =>
  import("./pages/Orders").then((m) => ({ default: m.OrdersPage })),
);
const OrderTrackingPage = lazy(() =>
  import("./pages/OrderTracking").then((m) => ({
    default: m.OrderTrackingPage,
  })),
);
const ProfilePage = lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.ProfilePage })),
);

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Suspense
        fallback={<LoadingSpinner fullPage size="lg" label="Loading…" />}
      >
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  ),
  notFoundComponent: NotFoundPage,
});

// Routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const restaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants/$restaurantId",
  component: RestaurantPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const orderTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/$orderId",
  component: OrderTrackingPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

// Router
const routeTree = rootRoute.addChildren([
  homeRoute,
  restaurantRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  ordersRoute,
  orderTrackingRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
