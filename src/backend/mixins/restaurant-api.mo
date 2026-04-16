import Common "../types/common";
import Types "../types/restaurant";
import RestaurantLib "../lib/restaurant";
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
  menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
  nextRestaurantId : List.List<Common.RestaurantId>,
  nextMenuItemId : List.List<Common.MenuItemId>,
) {
  public query func listRestaurants() : async [Types.Restaurant] {
    RestaurantLib.listRestaurants(restaurants);
  };

  public query func getRestaurant(id : Common.RestaurantId) : async ?Types.Restaurant {
    RestaurantLib.getRestaurant(restaurants, id);
  };

  public query func searchRestaurants(searchQuery : Text) : async [Types.Restaurant] {
    RestaurantLib.searchRestaurants(restaurants, searchQuery);
  };

  public query func filterRestaurants(
    cuisine : ?Text,
    minRating : ?Float,
    maxDeliveryMinutes : ?Nat,
  ) : async [Types.Restaurant] {
    RestaurantLib.filterRestaurants(restaurants, cuisine, minRating, maxDeliveryMinutes);
  };

  public query func getMenuItems(restaurantId : Common.RestaurantId) : async [Types.MenuItem] {
    RestaurantLib.getMenuItems(menuItems, restaurantId);
  };

  public query func getMenuItem(id : Common.MenuItemId) : async ?Types.MenuItem {
    RestaurantLib.getMenuItem(menuItems, id);
  };

  public shared ({ caller }) func upsertRestaurant(restaurant : Types.Restaurant) : async Types.Restaurant {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage restaurants");
    };
    RestaurantLib.upsertRestaurant(restaurants, nextRestaurantId, restaurant);
  };

  public shared ({ caller }) func upsertMenuItem(item : Types.MenuItem) : async Types.MenuItem {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage menu items");
    };
    RestaurantLib.upsertMenuItem(menuItems, nextMenuItemId, item);
  };

  public shared ({ caller }) func deleteRestaurant(id : Common.RestaurantId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete restaurants");
    };
    RestaurantLib.deleteRestaurant(restaurants, id);
  };

  public shared ({ caller }) func deleteMenuItem(id : Common.MenuItemId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };
    RestaurantLib.deleteMenuItem(menuItems, id);
  };
};
