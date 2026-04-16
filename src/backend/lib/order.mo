import Common "../types/common";
import OrderTypes "../types/order";
import UserTypes "../types/user";
import RestaurantTypes "../types/restaurant";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

module {
  // Compute totals for a placed order
  func computeTotals(
    items : [OrderTypes.CartItem],
    deliveryFeeCents : Nat,
  ) : (Nat, Nat, Nat, Nat) {
    var subtotal : Nat = 0;
    for (item in items.values()) {
      var itemPrice : Int = Int.fromNat(item.unitPriceCents);
      for (c in item.customizations.values()) {
        itemPrice := itemPrice + c.priceModifierCents;
      };
      let price : Nat = if (itemPrice > 0) { itemPrice.toNat() } else { 0 };
      subtotal := subtotal + price * item.quantity;
    };
    let tax = subtotal * 8 / 100; // 8% tax
    let total = subtotal + deliveryFeeCents + tax;
    (subtotal, deliveryFeeCents, tax, total);
  };

  public func placeOrder(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    nextId : List.List<Common.OrderId>,
    restaurants : Map.Map<Common.RestaurantId, RestaurantTypes.Restaurant>,
    menuItems : Map.Map<Common.MenuItemId, RestaurantTypes.MenuItem>,
    userAddresses : Map.Map<Common.UserId, List.List<UserTypes.DeliveryAddress>>,
    caller : Common.UserId,
    input : OrderTypes.PlaceOrderInput,
    stripeSessionId : Text,
  ) : OrderTypes.Order {
    let restaurant = switch (restaurants.get(input.restaurantId)) {
      case (?r) { r };
      case null { Runtime.trap("Restaurant not found") };
    };

    // Resolve delivery address
    let deliveryAddr : OrderTypes.DeliveryAddressSnapshot = switch (userAddresses.get(caller)) {
      case (null) { Runtime.trap("No delivery addresses found") };
      case (?addrList) {
        let found = addrList.find(func(a : UserTypes.DeliveryAddress) : Bool { a.id == input.deliveryAddressId });
        switch (found) {
          case (?a) { { street = a.street; city = a.city; state = a.state; zipCode = a.zipCode } };
          case null { Runtime.trap("Delivery address not found") };
        };
      };
    };

    // Build cart items with resolved names and prices
    let cartItems : [OrderTypes.CartItem] = input.items.map<OrderTypes.CartItemInput, OrderTypes.CartItem>(func(inputItem) {
      let menuItem = switch (menuItems.get(inputItem.menuItemId)) {
        case (?m) { m };
        case null { Runtime.trap("Menu item not found") };
      };
      {
        menuItemId = inputItem.menuItemId;
        menuItemName = menuItem.name;
        quantity = inputItem.quantity;
        unitPriceCents = menuItem.priceCents;
        customizations = inputItem.customizations;
        specialInstructions = inputItem.specialInstructions;
      };
    });

    let id = switch (nextId.first()) {
      case (?v) { v };
      case null { Runtime.trap("nextId list is empty") };
    };
    nextId.put(0, id + 1);

    let now = Time.now();
    let (subtotal, fee, tax, total) = computeTotals(cartItems, restaurant.deliveryFeecents);
    let estimatedDelivery = now + Int.fromNat(restaurant.deliveryTimeMinutes) * 60_000_000_000;

    let order : OrderTypes.Order = {
      id;
      customerId = caller;
      restaurantId = input.restaurantId;
      restaurantName = restaurant.name;
      items = cartItems;
      deliveryAddress = deliveryAddr;
      subtotalCents = subtotal;
      deliveryFeeCents = fee;
      taxCents = tax;
      totalCents = total;
      status = #confirmed;
      stripeSessionId;
      estimatedDeliveryTime = estimatedDelivery;
      createdAt = now;
      updatedAt = now;
    };

    orders.add(id, order);
    order;
  };

  public func getOrder(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    caller : Common.UserId,
    orderId : Common.OrderId,
  ) : ?OrderTypes.Order {
    switch (orders.get(orderId)) {
      case (?order) {
        if (Principal.equal(order.customerId, caller)) { ?order } else { null };
      };
      case null { null };
    };
  };

  public func getOrderHistory(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    caller : Common.UserId,
  ) : [OrderTypes.Order] {
    orders.values().filter(func(o) {
      Principal.equal(o.customerId, caller)
    }).toArray();
  };

  public func updateOrderStatus(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    orderId : Common.OrderId,
    status : OrderTypes.OrderStatus,
  ) : () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated = { order with status; updatedAt = Time.now() };
        orders.add(orderId, updated);
      };
    };
  };

  public func confirmOrderPayment(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    stripeSessionId : Text,
  ) : ?OrderTypes.Order {
    var found : ?OrderTypes.Order = null;
    for ((id, order) in orders.entries()) {
      if (order.stripeSessionId == stripeSessionId) {
        let updated = { order with status = #confirmed; updatedAt = Time.now() };
        orders.add(id, updated);
        found := ?updated;
      };
    };
    found;
  };
};
