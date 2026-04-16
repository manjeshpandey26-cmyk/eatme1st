import Common "common";

module {
  public type OrderStatus = {
    #confirmed;
    #beingPrepared;
    #readyForPickup;
    #driverAssigned;
    #inTransit;
    #delivered;
    #cancelled;
  };

  public type SelectedCustomization = {
    groupName : Text;
    selectedOption : Text;
    priceModifierCents : Int;
  };

  public type CartItem = {
    menuItemId : Common.MenuItemId;
    menuItemName : Text;
    quantity : Nat;
    unitPriceCents : Nat;
    customizations : [SelectedCustomization];
    specialInstructions : Text;
  };

  public type Order = {
    id : Common.OrderId;
    customerId : Common.UserId;
    restaurantId : Common.RestaurantId;
    restaurantName : Text;
    items : [CartItem];
    deliveryAddress : DeliveryAddressSnapshot;
    subtotalCents : Nat;
    deliveryFeeCents : Nat;
    taxCents : Nat;
    totalCents : Nat;
    status : OrderStatus;
    stripeSessionId : Text;
    estimatedDeliveryTime : Common.Timestamp;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type DeliveryAddressSnapshot = {
    street : Text;
    city : Text;
    state : Text;
    zipCode : Text;
  };

  public type CartItemInput = {
    menuItemId : Common.MenuItemId;
    quantity : Nat;
    customizations : [SelectedCustomization];
    specialInstructions : Text;
  };

  public type PlaceOrderInput = {
    restaurantId : Common.RestaurantId;
    items : [CartItemInput];
    deliveryAddressId : Common.AddressId;
  };
};
