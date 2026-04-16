import Common "../types/common";
import Types "../types/user";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

module {
  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(caller);
  };

  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
    profile : Types.UserProfile,
  ) : () {
    profiles.add(caller, profile);
  };

  public func getAddresses(
    addresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
    caller : Common.UserId,
  ) : [Types.DeliveryAddress] {
    switch (addresses.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public func addAddress(
    addresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
    nextId : List.List<Common.AddressId>,
    caller : Common.UserId,
    addressLabel : Text,
    street : Text,
    city : Text,
    state : Text,
    zipCode : Text,
  ) : Types.DeliveryAddress {
    let id = switch (nextId.first()) {
      case (?v) { v };
      case null { Runtime.trap("nextId list is empty") };
    };
    nextId.put(0, id + 1);

    let existing = switch (addresses.get(caller)) {
      case (?list) { list };
      case null {
        let newList = List.empty<Types.DeliveryAddress>();
        addresses.add(caller, newList);
        newList;
      };
    };

    // If this is the first address, make it default
    let isDefault = existing.size() == 0;
    // If isDefault requested explicitly not set here, default only if first
    let newAddress : Types.DeliveryAddress = {
      id;
      addressLabel;
      street;
      city;
      state;
      zipCode;
      isDefault;
    };
    existing.add(newAddress);
    newAddress;
  };

  public func updateAddress(
    addresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
    caller : Common.UserId,
    address : Types.DeliveryAddress,
  ) : () {
    switch (addresses.get(caller)) {
      case (null) { Runtime.trap("No addresses found") };
      case (?list) {
        list.mapInPlace(func(a) {
          if (a.id == address.id) { address } else { a }
        });
      };
    };
  };

  public func deleteAddress(
    addresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
    caller : Common.UserId,
    addressId : Common.AddressId,
  ) : () {
    switch (addresses.get(caller)) {
      case (null) { Runtime.trap("No addresses found") };
      case (?list) {
        let filtered = list.filter(func(a) { a.id != addressId });
        list.clear();
        list.append(filtered);
      };
    };
  };

  public func setDefaultAddress(
    addresses : Map.Map<Common.UserId, List.List<Types.DeliveryAddress>>,
    caller : Common.UserId,
    addressId : Common.AddressId,
  ) : () {
    switch (addresses.get(caller)) {
      case (null) { Runtime.trap("No addresses found") };
      case (?list) {
        list.mapInPlace(func(a) {
          { a with isDefault = (a.id == addressId) }
        });
      };
    };
  };
};
