import Common "common";

module {
  public type Cuisine = Text;

  public type Restaurant = {
    id : Common.RestaurantId;
    name : Text;
    cuisine : Cuisine;
    rating : Float;
    deliveryTimeMinutes : Nat;
    deliveryFeecents : Nat;
    imageUrl : Text;
    isOpen : Bool;
  };

  public type CustomizationOption = {
    name : Text;
    priceModifierCents : Int;
  };

  public type CustomizationGroup = {
    name : Text;
    required : Bool;
    maxSelections : Nat;
    options : [CustomizationOption];
  };

  public type MenuItem = {
    id : Common.MenuItemId;
    restaurantId : Common.RestaurantId;
    name : Text;
    description : Text;
    priceCents : Nat;
    imageUrl : Text;
    category : Text;
    isAvailable : Bool;
    customizations : [CustomizationGroup];
  };
};
