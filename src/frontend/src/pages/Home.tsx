import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Search,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { RestaurantCardSkeleton } from "../components/LoadingSpinner";
import {
  useFilterRestaurants,
  useListRestaurants,
  useSearchRestaurants,
} from "../hooks/useBackend";
import type { Restaurant } from "../types";
import { formatCents } from "../types";

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
] as const;

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
  "Salads",
];

const RATING_OPTIONS = [
  { label: "Any rating", value: null },
  { label: "4.5+ stars", value: 4.5 },
  { label: "4.0+ stars", value: 4.0 },
  { label: "3.5+ stars", value: 3.5 },
];

const DELIVERY_OPTIONS = [
  { label: "Any time", value: null },
  { label: "Under 20 min", value: 20n },
  { label: "Under 30 min", value: 30n },
  { label: "Under 45 min", value: 45n },
];

// ── Hero Banner ──────────────────────────────────────────────────────────────

function HeroBanner({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground hero-banner-bg">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/assets/generated/hero-food-spread.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 px-8 py-10 sm:py-14 max-w-lg">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight mb-3">
          Discover local
          <br />
          <span className="text-primary">favorites!</span>
        </h1>
        <p className="text-white/70 text-base mb-6">
          Fast delivery to San Francisco. Over 200 restaurants at your
          fingertips.
        </p>
        <Button
          onClick={onBrowse}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-2.5 rounded-full shadow-lg transition-smooth"
          data-ocid="hero.browse_button"
        >
          Browse Restaurants
        </Button>
      </div>
    </div>
  );
}

// ── Cuisine Chips ─────────────────────────────────────────────────────────────

function CuisineChips({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (c: string) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      data-ocid="home.cuisine_filter"
    >
      {CUISINES.map((c) => (
        <button
          type="button"
          key={c}
          onClick={() => onChange(c)}
          data-ocid={`home.cuisine.${c.toLowerCase()}`}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
            selected === c
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────

function FilterSelect<T>({
  options,
  value,
  onChange,
  icon,
  ocid,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  icon?: React.ReactNode;
  ocid: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid={ocid}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-primary/50 transition-smooth"
      >
        {icon}
        <span>{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-smooth ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1.5 left-0 z-50 bg-card border border-border rounded-xl shadow-elevated min-w-[160px] py-1"
          data-ocid={`${ocid}_dropdown`}
        >
          {options.map((opt) => (
            <button
              type="button"
              key={String(opt.label)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted ${
                opt.value === value
                  ? "text-primary font-semibold"
                  : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
      <span className="text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

// ── Restaurant Card ───────────────────────────────────────────────────────────

function RestaurantCard({
  restaurant,
  index,
}: {
  restaurant: Restaurant;
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const delay = Math.min(index * 0.06, 0.4);

  return (
    <Link
      to="/restaurants/$restaurantId"
      params={{ restaurantId: restaurant.id.toString() }}
      data-ocid={`home.restaurant.item.${index + 1}`}
      className="restaurant-card group cursor-pointer block animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="food-image h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Open/Closed badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`text-xs font-semibold border-0 ${
              restaurant.isOpen
                ? "bg-emerald-500/90 text-white"
                : "bg-foreground/70 text-background"
            }`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>

        {/* Favourite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          data-ocid={`home.restaurant.favorite.${index + 1}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-smooth hover:scale-110"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-smooth ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-base text-foreground truncate min-w-0">
            {restaurant.name}
          </h3>
          <StarRating rating={restaurant.rating} />
        </div>

        <p className="text-sm text-muted-foreground mb-3 truncate">
          {restaurant.cuisine}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {restaurant.deliveryTimeMinutes.toString()} min
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-primary" />
            {restaurant.deliveryFeecents === 0n
              ? "Free delivery"
              : `${formatCents(restaurant.deliveryFeecents)} fee`}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-20 gap-5 text-center"
      data-ocid="home.restaurant_list.empty_state"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-display font-bold text-xl text-foreground mb-1">
          {query ? `No results for "${query}"` : "No restaurants found"}
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Try adjusting your search or filters to discover more great places
          near you.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onReset}
        className="rounded-full"
        data-ocid="home.empty_state.reset_button"
      >
        Clear filters
      </Button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDelivery, setMaxDelivery] = useState<bigint | null>(null);
  const restaurantListRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasSearch = debouncedQuery.trim().length > 0;
  const hasFilter =
    selectedCuisine !== "All" || minRating !== null || maxDelivery !== null;

  const { data: allRestaurants, isLoading: listLoading } = useListRestaurants();
  const { data: searchResults, isLoading: searchLoading } =
    useSearchRestaurants(debouncedQuery);
  const { data: filterResults, isLoading: filterLoading } =
    useFilterRestaurants(
      selectedCuisine !== "All" ? selectedCuisine : null,
      minRating,
      maxDelivery,
    );

  const isLoading =
    listLoading || (hasSearch && searchLoading) || (hasFilter && filterLoading);

  const restaurants: Restaurant[] = useMemo(() => {
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
    restaurantListRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Layout>
      {/* Sticky search + filters */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants or cuisines…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary"
              data-ocid="home.search_input"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <FilterSelect
              options={RATING_OPTIONS}
              value={minRating}
              onChange={setMinRating}
              icon={<Star className="w-3.5 h-3.5 text-primary" />}
              ocid="home.rating_filter"
            />
            <FilterSelect
              options={DELIVERY_OPTIONS}
              value={maxDelivery}
              onChange={setMaxDelivery}
              icon={<Clock className="w-3.5 h-3.5 text-primary" />}
              ocid="home.delivery_filter"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero — only show when no active search/filter */}
        {!hasSearch && !hasFilter && <HeroBanner onBrowse={scrollToList} />}

        {/* Cuisine chips */}
        <section aria-label="Filter by cuisine">
          <CuisineChips
            selected={selectedCuisine}
            onChange={setSelectedCuisine}
          />
        </section>

        {/* Restaurant list */}
        <section
          ref={restaurantListRef}
          aria-label="Restaurants"
          data-ocid="home.restaurant_list"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                {hasSearch
                  ? `Results for "${debouncedQuery}"`
                  : selectedCuisine !== "All"
                    ? `${selectedCuisine} Restaurants`
                    : "All Restaurants"}
              </h2>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {restaurants.length} place
                  {restaurants.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {/* Location */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              data-ocid="home.restaurant_list.loading_state"
            >
              {SKELETON_KEYS.map((key) => (
                <RestaurantCardSkeleton key={key} />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="grid grid-cols-1">
              <EmptyState query={debouncedQuery} onReset={resetFilters} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {restaurants.map((r, i) => (
                <RestaurantCard
                  key={r.id.toString()}
                  restaurant={r}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA if showing all */}
        {!isLoading && !hasSearch && !hasFilter && restaurants.length > 0 && (
          <div className="flex justify-center pt-2 pb-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-3 rounded-full shadow-md transition-smooth"
              onClick={scrollToList}
              data-ocid="home.browse_all_button"
            >
              Browse All Restaurants
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
