import Common "../types/common";
import Types "../types/user";
import UserLib "../lib/user";
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, Types.UserProfile>,
  userAddresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
  nextAddressId : List.List<Common.AddressId>,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfile {
    UserLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Types.UserProfile) : async () {
    UserLib.saveProfile(userProfiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Common.UserId) : async ?Types.UserProfile {
    UserLib.getProfile(userProfiles, user);
  };

  public query ({ caller }) func getDeliveryAddresses() : async [Types.DeliveryAddress] {
    UserLib.getAddresses(userAddresses, caller);
  };

  public shared ({ caller }) func addDeliveryAddress(
    addressLabel : Text,
    street : Text,
    city : Text,
    state : Text,
    zipCode : Text,
  ) : async Types.DeliveryAddress {
    UserLib.addAddress(userAddresses, nextAddressId, caller, addressLabel, street, city, state, zipCode);
  };

  public shared ({ caller }) func updateDeliveryAddress(address : Types.DeliveryAddress) : async () {
    UserLib.updateAddress(userAddresses, caller, address);
  };

  public shared ({ caller }) func deleteDeliveryAddress(addressId : Common.AddressId) : async () {
    UserLib.deleteAddress(userAddresses, caller, addressId);
  };

  public shared ({ caller }) func setDefaultDeliveryAddress(addressId : Common.AddressId) : async () {
    UserLib.setDefaultAddress(userAddresses, caller, addressId);
  };
};
