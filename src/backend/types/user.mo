import Common "common";

module {
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type DeliveryAddress = {
    id : Common.AddressId;
    addressLabel : Text;
    street : Text;
    city : Text;
    state : Text;
    zipCode : Text;
    isDefault : Bool;
  };
};
