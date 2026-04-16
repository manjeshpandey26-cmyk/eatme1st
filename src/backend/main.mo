import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import Common "types/common";
import UserTypes "types/user";
import RestaurantTypes "types/restaurant";
import OrderTypes "types/order";
import RestaurantLib "lib/restaurant";
import UserApi "mixins/user-api";
import RestaurantApi "mixins/restaurant-api";
import OrderApi "mixins/order-api";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User state
  let userProfiles = Map.empty<Common.UserId, UserTypes.UserProfile>();
  let userAddresses = Map.empty<Common.UserId, List.List<UserTypes.DeliveryAddress>>();
  let nextAddressId = List.singleton<Common.AddressId>(1);

  include UserApi(accessControlState, userProfiles, userAddresses, nextAddressId);

  // Restaurant state
  let restaurants = Map.empty<Common.RestaurantId, RestaurantTypes.Restaurant>();
  let menuItems = Map.empty<Common.MenuItemId, RestaurantTypes.MenuItem>();
  let nextRestaurantId = List.singleton<Common.RestaurantId>(1);
  let nextMenuItemId = List.singleton<Common.MenuItemId>(1);

  // Seed sample data on first initialization
  RestaurantLib.seedData(restaurants, menuItems, nextRestaurantId, nextMenuItemId);

  include RestaurantApi(accessControlState, restaurants, menuItems, nextRestaurantId, nextMenuItemId);

  // Order state
  let orders = Map.empty<Common.OrderId, OrderTypes.Order>();
  let nextOrderId = List.singleton<Common.OrderId>(1);

  include OrderApi(accessControlState, orders, nextOrderId, restaurants, menuItems, userAddresses);

  // Stripe configuration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
