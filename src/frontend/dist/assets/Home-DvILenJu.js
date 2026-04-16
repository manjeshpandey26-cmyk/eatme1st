import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Layout, S as Search, M as MapPin, R as RestaurantCardSkeleton, B as Button, U as UtensilsCrossed, a as Link, b as Badge } from "./index-BRrb9eOw.js";
import { I as Input } from "./input-DC7RXpBv.js";
import { u as useListRestaurants, a as useSearchRestaurants, b as useFilterRestaurants } from "./useBackend-BSOypR0Y.js";
import { f as formatCents } from "./index-CZYV8lVp.js";
import { S as Star } from "./star-CvRliYhZ.js";
import { C as Clock } from "./clock-B0R97huC.js";
import { T as Truck } from "./truck-BC2q8ht0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h"
];
const CUISINES = [
  "All",
  "Pizza",
  "Burgers",
  "Sushi",
  "Mexican",
  "Chinese",
  "Indian",
  "Thai",
  "Italian",
  "Salads"
];
const RATING_OPTIONS = [
  { label: "Any rating", value: null },
  { label: "4.5+ stars", value: 4.5 },
  { label: "4.0+ stars", value: 4 },
  { label: "3.5+ stars", value: 3.5 }
];
const DELIVERY_OPTIONS = [
  { label: "Any time", value: null },
  { label: "Under 20 min", value: 20n },
  { label: "Under 30 min", value: 30n },
  { label: "Under 45 min", value: 45n }
];
function HeroBanner({ onBrowse }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground hero-banner-bg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 opacity-20",
        style: {
          backgroundImage: "url('/assets/generated/hero-food-spread.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 px-8 py-10 sm:py-14 max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-3", children: [
        "Discover local",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "favorites!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-base mb-6", children: "Fast delivery to San Francisco. Over 200 restaurants at your fingertips." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onBrowse,
          className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-2.5 rounded-full shadow-lg transition-smooth",
          "data-ocid": "hero.browse_button",
          children: "Browse Restaurants"
        }
      )
    ] })
  ] });
}
function CuisineChips({
  selected,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
      "data-ocid": "home.cuisine_filter",
      children: CUISINES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(c),
          "data-ocid": `home.cuisine.${c.toLowerCase()}`,
          className: `shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${selected === c ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
          children: c
        },
        c
      ))
    }
  );
}
function FilterSelect({
  options,
  value,
  onChange,
  icon,
  ocid
}) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const current = options.find((o) => o.value === value) ?? options[0];
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        "data-ocid": ocid,
        className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 transition-smooth",
        children: [
          icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: current.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `w-3.5 h-3.5 transition-smooth ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-full mt-1.5 left-0 z-50 bg-card border border-border rounded-xl shadow-elevated min-w-[160px] py-1",
        "data-ocid": `${ocid}_dropdown`,
        children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              onChange(opt.value);
              setOpen(false);
            },
            className: `w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted ${opt.value === value ? "text-primary font-semibold" : "text-foreground"}`,
            children: opt.label
          },
          String(opt.label)
        ))
      }
    )
  ] });
}
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-primary text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: rating.toFixed(1) })
  ] });
}
function RestaurantCard({
  restaurant,
  index
}) {
  const [liked, setLiked] = reactExports.useState(false);
  const delay = Math.min(index * 0.06, 0.4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/restaurants/$restaurantId",
      params: { restaurantId: restaurant.id.toString() },
      "data-ocid": `home.restaurant.item.${index + 1}`,
      className: "restaurant-card group cursor-pointer block animate-fade-in-up",
      style: { animationDelay: `${delay}s` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 overflow-hidden bg-muted", children: [
          restaurant.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: restaurant.imageUrl,
              alt: restaurant.name,
              className: "food-image h-full transition-transform duration-300 group-hover:scale-105",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-xs font-semibold border-0 ${restaurant.isOpen ? "bg-emerald-500/90 text-white" : "bg-foreground/70 text-background"}`,
              children: restaurant.isOpen ? "Open" : "Closed"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setLiked((v) => !v);
              },
              "data-ocid": `home.restaurant.favorite.${index + 1}`,
              className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-smooth hover:scale-110",
              "aria-label": liked ? "Remove from favorites" : "Add to favorites",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: `w-4 h-4 transition-smooth ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground truncate min-w-0", children: restaurant.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: restaurant.rating })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3 truncate", children: restaurant.cuisine }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }),
              restaurant.deliveryTimeMinutes.toString(),
              " min"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-3.5 h-3.5 text-primary" }),
              restaurant.deliveryFeecents === 0n ? "Free delivery" : `${formatCents(restaurant.deliveryFeecents)} fee`
            ] })
          ] })
        ] })
      ]
    }
  );
}
function EmptyState({
  query,
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "col-span-full flex flex-col items-center justify-center py-20 gap-5 text-center",
      "data-ocid": "home.restaurant_list.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-10 h-10 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground mb-1", children: query ? `No results for "${query}"` : "No restaurants found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mx-auto", children: "Try adjusting your search or filters to discover more great places near you." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onReset,
            className: "rounded-full",
            "data-ocid": "home.empty_state.reset_button",
            children: "Clear filters"
          }
        )
      ]
    }
  );
}
function HomePage() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [selectedCuisine, setSelectedCuisine] = reactExports.useState("All");
  const [minRating, setMinRating] = reactExports.useState(null);
  const [maxDelivery, setMaxDelivery] = reactExports.useState(null);
  const restaurantListRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const hasSearch = debouncedQuery.trim().length > 0;
  const hasFilter = selectedCuisine !== "All" || minRating !== null || maxDelivery !== null;
  const { data: allRestaurants, isLoading: listLoading } = useListRestaurants();
  const { data: searchResults, isLoading: searchLoading } = useSearchRestaurants(debouncedQuery);
  const { data: filterResults, isLoading: filterLoading } = useFilterRestaurants(
    selectedCuisine !== "All" ? selectedCuisine : null,
    minRating,
    maxDelivery
  );
  const isLoading = listLoading || hasSearch && searchLoading || hasFilter && filterLoading;
  const restaurants = reactExports.useMemo(() => {
    if (hasSearch) return searchResults ?? [];
    if (hasFilter) return filterResults ?? [];
    return allRestaurants ?? [];
  }, [hasSearch, hasFilter, searchResults, filterResults, allRestaurants]);
  function resetFilters() {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCuisine("All");
    setMinRating(null);
    setMaxDelivery(null);
  }
  function scrollToList() {
    var _a;
    (_a = restaurantListRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: "Search restaurants or cuisines…",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9 rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary",
            "data-ocid": "home.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterSelect,
          {
            options: RATING_OPTIONS,
            value: minRating,
            onChange: setMinRating,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-primary" }),
            ocid: "home.rating_filter"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterSelect,
          {
            options: DELIVERY_OPTIONS,
            value: maxDelivery,
            onChange: setMaxDelivery,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }),
            ocid: "home.delivery_filter"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8", children: [
      !hasSearch && !hasFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBanner, { onBrowse: scrollToList }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Filter by cuisine", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CuisineChips,
        {
          selected: selectedCuisine,
          onChange: setSelectedCuisine
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          ref: restaurantListRef,
          "aria-label": "Restaurants",
          "data-ocid": "home.restaurant_list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground", children: hasSearch ? `Results for "${debouncedQuery}"` : selectedCuisine !== "All" ? `${selectedCuisine} Restaurants` : "All Restaurants" }),
                !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                  restaurants.length,
                  " place",
                  restaurants.length !== 1 ? "s" : "",
                  " found"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "San Francisco, CA" })
              ] })
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
                "data-ocid": "home.restaurant_list.loading_state",
                children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantCardSkeleton, {}, key))
              }
            ) : restaurants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { query: debouncedQuery, onReset: resetFilters }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5", children: restaurants.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              RestaurantCard,
              {
                restaurant: r,
                index: i
              },
              r.id.toString()
            )) })
          ]
        }
      ),
      !isLoading && !hasSearch && !hasFilter && restaurants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-3 rounded-full shadow-md transition-smooth",
          onClick: scrollToList,
          "data-ocid": "home.browse_all_button",
          children: "Browse All Restaurants"
        }
      ) })
    ] })
  ] });
}
export {
  HomePage
};
