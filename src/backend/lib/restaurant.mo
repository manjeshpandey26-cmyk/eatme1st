import Common "../types/common";
import Types "../types/restaurant";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

module {
  public func listRestaurants(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
  ) : [Types.Restaurant] {
    restaurants.values().toArray();
  };

  public func getRestaurant(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    id : Common.RestaurantId,
  ) : ?Types.Restaurant {
    restaurants.get(id);
  };

  public func searchRestaurants(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    searchQuery : Text,
  ) : [Types.Restaurant] {
    let lower = searchQuery.toLower();
    restaurants.values().filter(func(r) {
      r.name.toLower().contains(#text lower) or r.cuisine.toLower().contains(#text lower)
    }).toArray();
  };

  public func filterRestaurants(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    cuisine : ?Text,
    minRating : ?Float,
    maxDeliveryMinutes : ?Nat,
  ) : [Types.Restaurant] {
    restaurants.values().filter(func(r) {
      let cuisineMatch = switch (cuisine) {
        case (null) { true };
        case (?c) { r.cuisine.toLower() == c.toLower() };
      };
      let ratingMatch = switch (minRating) {
        case (null) { true };
        case (?m) { r.rating >= m };
      };
      let deliveryMatch = switch (maxDeliveryMinutes) {
        case (null) { true };
        case (?max) { r.deliveryTimeMinutes <= max };
      };
      cuisineMatch and ratingMatch and deliveryMatch;
    }).toArray();
  };

  public func getMenuItems(
    menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
    restaurantId : Common.RestaurantId,
  ) : [Types.MenuItem] {
    menuItems.values().filter(func(m) {
      m.restaurantId == restaurantId
    }).toArray();
  };

  public func getMenuItem(
    menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
    id : Common.MenuItemId,
  ) : ?Types.MenuItem {
    menuItems.get(id);
  };

  public func upsertRestaurant(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    nextId : List.List<Common.RestaurantId>,
    restaurant : Types.Restaurant,
  ) : Types.Restaurant {
    if (restaurant.id == 0) {
      // New restaurant
      let id = switch (nextId.first()) {
        case (?v) { v };
        case null { Runtime.trap("nextId list is empty") };
      };
      nextId.put(0, id + 1);
      let newRestaurant = { restaurant with id };
      restaurants.add(id, newRestaurant);
      newRestaurant;
    } else {
      restaurants.add(restaurant.id, restaurant);
      restaurant;
    };
  };

  public func upsertMenuItem(
    menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
    nextId : List.List<Common.MenuItemId>,
    item : Types.MenuItem,
  ) : Types.MenuItem {
    if (item.id == 0) {
      let id = switch (nextId.first()) {
        case (?v) { v };
        case null { Runtime.trap("nextId list is empty") };
      };
      nextId.put(0, id + 1);
      let newItem = { item with id };
      menuItems.add(id, newItem);
      newItem;
    } else {
      menuItems.add(item.id, item);
      item;
    };
  };

  public func deleteRestaurant(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    id : Common.RestaurantId,
  ) : () {
    restaurants.remove(id);
  };

  public func deleteMenuItem(
    menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
    id : Common.MenuItemId,
  ) : () {
    menuItems.remove(id);
  };

  // Seed sample data — called once on first canister initialization
  public func seedData(
    restaurants : Map.Map<Common.RestaurantId, Types.Restaurant>,
    menuItems : Map.Map<Common.MenuItemId, Types.MenuItem>,
    nextRestaurantId : List.List<Common.RestaurantId>,
    nextMenuItemId : List.List<Common.MenuItemId>,
  ) : () {
    if (not restaurants.isEmpty()) {
      return; // Already seeded
    };

    let r1 = upsertRestaurant(restaurants, nextRestaurantId, {
      id = 0;
      name = "Burger Palace";
      cuisine = "American";
      rating = 4.5;
      deliveryTimeMinutes = 25;
      deliveryFeecents = 199;
      imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400";
      isOpen = true;
    });

    let r2 = upsertRestaurant(restaurants, nextRestaurantId, {
      id = 0;
      name = "Sakura Sushi";
      cuisine = "Japanese";
      rating = 4.8;
      deliveryTimeMinutes = 35;
      deliveryFeecents = 299;
      imageUrl = "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400";
      isOpen = true;
    });

    let r3 = upsertRestaurant(restaurants, nextRestaurantId, {
      id = 0;
      name = "Mama Mia Pizza";
      cuisine = "Italian";
      rating = 4.3;
      deliveryTimeMinutes = 30;
      deliveryFeecents = 149;
      imageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400";
      isOpen = true;
    });

    let r4 = upsertRestaurant(restaurants, nextRestaurantId, {
      id = 0;
      name = "Spice Garden";
      cuisine = "Indian";
      rating = 4.6;
      deliveryTimeMinutes = 40;
      deliveryFeecents = 249;
      imageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400";
      isOpen = true;
    });

    let r5 = upsertRestaurant(restaurants, nextRestaurantId, {
      id = 0;
      name = "Taco Fiesta";
      cuisine = "Mexican";
      rating = 4.2;
      deliveryTimeMinutes = 20;
      deliveryFeecents = 99;
      imageUrl = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400";
      isOpen = true;
    });

    // Burger Palace menu
    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r1.id;
      name = "Classic Cheeseburger";
      description = "Juicy beef patty with cheddar, lettuce, tomato, and our secret sauce";
      priceCents = 1299;
      imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400";
      category = "Burgers";
      isAvailable = true;
      customizations = [
        {
          name = "Patty Size";
          required = true;
          maxSelections = 1;
          options = [
            { name = "Single"; priceModifierCents = 0 },
            { name = "Double"; priceModifierCents = 200 },
            { name = "Triple"; priceModifierCents = 400 },
          ];
        },
        {
          name = "Extras";
          required = false;
          maxSelections = 3;
          options = [
            { name = "Bacon"; priceModifierCents = 150 },
            { name = "Avocado"; priceModifierCents = 100 },
            { name = "Extra Cheese"; priceModifierCents = 75 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r1.id;
      name = "Crispy Chicken Sandwich";
      description = "Hand-breaded chicken breast with pickles and honey mustard";
      priceCents = 1199;
      imageUrl = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400";
      category = "Sandwiches";
      isAvailable = true;
      customizations = [
        {
          name = "Sauce";
          required = false;
          maxSelections = 1;
          options = [
            { name = "Honey Mustard"; priceModifierCents = 0 },
            { name = "BBQ"; priceModifierCents = 0 },
            { name = "Spicy Mayo"; priceModifierCents = 0 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r1.id;
      name = "Loaded Fries";
      description = "Crispy fries topped with cheese sauce, bacon bits, and green onions";
      priceCents = 799;
      imageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400";
      category = "Sides";
      isAvailable = true;
      customizations = [];
    });

    // Sakura Sushi menu
    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r2.id;
      name = "Salmon Nigiri (2pc)";
      description = "Fresh Atlantic salmon over seasoned sushi rice";
      priceCents = 899;
      imageUrl = "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400";
      category = "Nigiri";
      isAvailable = true;
      customizations = [];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r2.id;
      name = "Dragon Roll";
      description = "Shrimp tempura inside, avocado and eel on top";
      priceCents = 1599;
      imageUrl = "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400";
      category = "Rolls";
      isAvailable = true;
      customizations = [
        {
          name = "Spice Level";
          required = false;
          maxSelections = 1;
          options = [
            { name = "Mild"; priceModifierCents = 0 },
            { name = "Medium"; priceModifierCents = 0 },
            { name = "Spicy"; priceModifierCents = 0 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r2.id;
      name = "Miso Soup";
      description = "Traditional Japanese soup with tofu, seaweed, and green onions";
      priceCents = 399;
      imageUrl = "https://images.unsplash.com/photo-1547592180-85f173990554?w=400";
      category = "Soups";
      isAvailable = true;
      customizations = [];
    });

    // Mama Mia Pizza menu
    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r3.id;
      name = "Margherita Pizza";
      description = "Classic tomato sauce, fresh mozzarella, and basil on thin crust";
      priceCents = 1499;
      imageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400";
      category = "Pizzas";
      isAvailable = true;
      customizations = [
        {
          name = "Size";
          required = true;
          maxSelections = 1;
          options = [
            { name = "Small (10\")"; priceModifierCents = 0 },
            { name = "Medium (12\")"; priceModifierCents = 300 },
            { name = "Large (14\")"; priceModifierCents = 600 },
          ];
        },
        {
          name = "Crust";
          required = false;
          maxSelections = 1;
          options = [
            { name = "Thin"; priceModifierCents = 0 },
            { name = "Thick"; priceModifierCents = 0 },
            { name = "Stuffed"; priceModifierCents = 250 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r3.id;
      name = "Fettuccine Alfredo";
      description = "Fresh pasta in rich creamy parmesan sauce";
      priceCents = 1699;
      imageUrl = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400";
      category = "Pasta";
      isAvailable = true;
      customizations = [
        {
          name = "Add-ons";
          required = false;
          maxSelections = 2;
          options = [
            { name = "Grilled Chicken"; priceModifierCents = 350 },
            { name = "Shrimp"; priceModifierCents = 450 },
            { name = "Extra Sauce"; priceModifierCents = 100 },
          ];
        },
      ];
    });

    // Spice Garden menu
    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r4.id;
      name = "Butter Chicken";
      description = "Tender chicken in creamy tomato-based curry sauce, served with basmati rice";
      priceCents = 1799;
      imageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400";
      category = "Curries";
      isAvailable = true;
      customizations = [
        {
          name = "Spice Level";
          required = true;
          maxSelections = 1;
          options = [
            { name = "Mild"; priceModifierCents = 0 },
            { name = "Medium"; priceModifierCents = 0 },
            { name = "Hot"; priceModifierCents = 0 },
            { name = "Extra Hot"; priceModifierCents = 0 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r4.id;
      name = "Garlic Naan";
      description = "Freshly baked flatbread brushed with garlic butter";
      priceCents = 499;
      imageUrl = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400";
      category = "Breads";
      isAvailable = true;
      customizations = [];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r4.id;
      name = "Samosa (2pc)";
      description = "Crispy pastry filled with spiced potatoes and peas";
      priceCents = 699;
      imageUrl = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400";
      category = "Appetizers";
      isAvailable = true;
      customizations = [];
    });

    // Taco Fiesta menu
    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r5.id;
      name = "Street Tacos (3pc)";
      description = "Corn tortillas with your choice of meat, cilantro, onion, and salsa verde";
      priceCents = 1099;
      imageUrl = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400";
      category = "Tacos";
      isAvailable = true;
      customizations = [
        {
          name = "Protein";
          required = true;
          maxSelections = 1;
          options = [
            { name = "Carne Asada"; priceModifierCents = 0 },
            { name = "Al Pastor"; priceModifierCents = 0 },
            { name = "Chicken"; priceModifierCents = 0 },
            { name = "Carnitas"; priceModifierCents = 0 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r5.id;
      name = "Nachos Supreme";
      description = "Tortilla chips loaded with beans, cheese, jalapeños, sour cream, and guacamole";
      priceCents = 1299;
      imageUrl = "https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=400";
      category = "Sharing";
      isAvailable = true;
      customizations = [
        {
          name = "Add Protein";
          required = false;
          maxSelections = 1;
          options = [
            { name = "Chicken"; priceModifierCents = 200 },
            { name = "Beef"; priceModifierCents = 200 },
            { name = "Shrimp"; priceModifierCents = 300 },
          ];
        },
      ];
    });

    ignore upsertMenuItem(menuItems, nextMenuItemId, {
      id = 0;
      restaurantId = r5.id;
      name = "Burrito Bowl";
      description = "Cilantro-lime rice, black beans, pico de gallo, and your choice of protein";
      priceCents = 1399;
      imageUrl = "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400";
      category = "Bowls";
      isAvailable = true;
      customizations = [
        {
          name = "Protein";
          required = true;
          maxSelections = 1;
          options = [
            { name = "Chicken"; priceModifierCents = 0 },
            { name = "Beef"; priceModifierCents = 0 },
            { name = "Veggie"; priceModifierCents = 0 },
          ];
        },
        {
          name = "Extras";
          required = false;
          maxSelections = 3;
          options = [
            { name = "Guacamole"; priceModifierCents = 150 },
            { name = "Sour Cream"; priceModifierCents = 75 },
            { name = "Extra Cheese"; priceModifierCents = 75 },
          ];
        },
      ];
    });
  };
};
