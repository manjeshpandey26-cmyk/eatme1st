import Common "../types/common";
import OrderTypes "../types/order";
import UserTypes "../types/user";
import RestaurantTypes "../types/restaurant";
import OrderLib "../lib/order";
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  orders : Map.Map<Common.OrderId, OrderTypes.Order>,
  nextOrderId : List.List<Common.OrderId>,
  restaurants : Map.Map<Common.RestaurantId, RestaurantTypes.Restaurant>,
  menuItems : Map.Map<Common.MenuItemId, RestaurantTypes.MenuItem>,
  userAddresses : Map.Map<Common.UserId, List.List<UserTypes.DeliveryAddress>>,
) {
  public shared ({ caller }) func placeOrder(input : OrderTypes.PlaceOrderInput, stripeSessionId : Text) : async OrderTypes.Order {
    OrderLib.placeOrder(orders, nextOrderId, restaurants, menuItems, userAddresses, caller, input, stripeSessionId);
  };

  public query ({ caller }) func getOrder(orderId : Common.OrderId) : async ?OrderTypes.Order {
    OrderLib.getOrder(orders, caller, orderId);
  };

  public query ({ caller }) func getOrderHistory() : async [OrderTypes.Order] {
    OrderLib.getOrderHistory(orders, caller);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Common.OrderId, status : OrderTypes.OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    OrderLib.updateOrderStatus(orders, orderId, status);
  };

  public func confirmOrderPayment(stripeSessionId : Text) : async ?OrderTypes.Order {
    OrderLib.confirmOrderPayment(orders, stripeSessionId);
  };
};
