import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CustomizationGroup,
  MenuItem,
  SelectedCustomization,
} from "../backend";
import { Layout } from "../components/Layout";
import { MenuItemSkeleton } from "../components/LoadingSpinner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { Textarea } from "../components/ui/textarea";
import { useGetMenuItems, useGetRestaurant } from "../hooks/useBackend";
import { useCart } from "../hooks/useCart";
import { formatCents } from "../types";

// ── Category Nav ─────────────────────────────────────────────────────────────

function CategoryNav({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="sticky top-16 z-20 bg-background border-b border-border shadow-subtle">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid="menu.category.tab"
              onClick={() => onSelect(cat)}
              className={
                activeCategory === cat
                  ? "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-smooth bg-primary text-primary-foreground"
                  : "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Customization Group Row ───────────────────────────────────────────────────

function CustomizationGroupRow({
  group,
  selected,
  onToggle,
}: {
  group: CustomizationGroup;
  selected: SelectedCustomization[];
  onToggle: (
    groupName: string,
    option: { name: string; priceModifierCents: bigint },
  ) => void;
}) {
  const maxSel = Number(group.maxSelections);
  const selectedInGroup = selected.filter((s) => s.groupName === group.name);
  const atMax = selectedInGroup.length >= maxSel;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-semibold text-sm text-foreground">{group.name}</h4>
        {group.required && (
          <Badge variant="secondary" className="text-xs py-0">
            Required
          </Badge>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {maxSel > 1 ? `Up to ${maxSel}` : "Choose 1"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {group.options.map((opt) => {
          const isSelected = selectedInGroup.some(
            (s) => s.selectedOption === opt.name,
          );
          return (
            <button
              key={opt.name}
              type="button"
              data-ocid="menu.customization.toggle"
              onClick={() => onToggle(group.name, opt)}
              disabled={!isSelected && atMax}
              className={
                isSelected
                  ? "flex items-center justify-between p-3 rounded-xl border text-left transition-smooth text-sm border-primary bg-primary/10 text-foreground"
                  : atMax
                    ? "flex items-center justify-between p-3 rounded-xl border text-left transition-smooth text-sm border-border bg-muted/40 text-muted-foreground opacity-50 cursor-not-allowed"
                    : "flex items-center justify-between p-3 rounded-xl border text-left transition-smooth text-sm border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground"
              }
            >
              <span className="font-medium truncate min-w-0 pr-2">
                {opt.name}
              </span>
              {Number(opt.priceModifierCents) > 0 && (
                <span className="text-primary shrink-0 font-semibold">
                  +{formatCents(opt.priceModifierCents)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Add to Cart Sheet ─────────────────────────────────────────────────────────

interface AddToCartSheetProps {
  item: MenuItem | null;
  restaurantId: bigint;
  restaurantName: string;
  onClose: () => void;
}

function AddToCartSheet({
  item,
  restaurantId,
  restaurantName,
  onClose,
}: AddToCartSheetProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<SelectedCustomization[]>([]);
  const [instructions, setInstructions] = useState("");

  const itemIdStr = item ? item.id.toString() : "";
  useEffect(() => {
    if (!itemIdStr) return;
    setQuantity(1);
    setSelected([]);
    setInstructions("");
  }, [itemIdStr]);

  const priceModifier = selected.reduce(
    (sum, s) => sum + Number(s.priceModifierCents),
    0,
  );
  const basePrice = item ? Number(item.priceCents) : 0;
  const totalCents = (basePrice + priceModifier) * quantity;

  function handleToggle(
    groupName: string,
    option: { name: string; priceModifierCents: bigint },
  ) {
    const group = item?.customizations.find((g) => g.name === groupName);
    if (!group) return;
    const maxSel = Number(group.maxSelections);
    const alreadySelected = selected.find(
      (s) => s.groupName === groupName && s.selectedOption === option.name,
    );
    if (alreadySelected) {
      setSelected((prev) =>
        prev.filter(
          (s) =>
            !(s.groupName === groupName && s.selectedOption === option.name),
        ),
      );
    } else {
      const inGroup = selected.filter((s) => s.groupName === groupName);
      if (inGroup.length >= maxSel) return;
      setSelected((prev) => [
        ...prev,
        {
          groupName,
          selectedOption: option.name,
          priceModifierCents: option.priceModifierCents,
        },
      ]);
    }
  }

  function handleAdd() {
    if (!item) return;
    addItem(
      item,
      quantity,
      selected,
      instructions,
      restaurantId,
      restaurantName,
    );
    onClose();
  }

  const hasGroups = (item?.customizations?.length ?? 0) > 0;

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        data-ocid="menu.add_item.dialog"
      >
        <SheetHeader className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-xl font-display leading-tight">
              {item?.name}
            </SheetTitle>
            <button
              type="button"
              onClick={onClose}
              data-ocid="menu.add_item.close_button"
              className="shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        {/* Item image */}
        {item?.imageUrl && (
          <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-muted">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        {item?.description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Base price */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">
            Base price
          </span>
          <span className="font-semibold text-foreground">
            {item ? formatCents(item.priceCents) : ""}
          </span>
        </div>

        {/* Customization groups */}
        {hasGroups && item && (
          <div className="mb-5">
            {item.customizations.map((group) => (
              <CustomizationGroupRow
                key={group.name}
                group={group}
                selected={selected}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* Special instructions */}
        <div className="mb-6">
          <label
            htmlFor="special-instructions"
            className="block text-sm font-semibold mb-2 text-foreground"
          >
            Special instructions
          </label>
          <Textarea
            id="special-instructions"
            data-ocid="menu.special_instructions.textarea"
            placeholder="Any allergies, special requests…"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="resize-none text-sm"
            rows={3}
          />
        </div>

        {/* Quantity picker + Add to cart */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2">
            <button
              type="button"
              data-ocid="menu.quantity.decrease_button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-smooth disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="w-5 text-center font-semibold text-sm"
              data-ocid="menu.quantity.display"
            >
              {quantity}
            </span>
            <button
              type="button"
              data-ocid="menu.quantity.increase_button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-smooth"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            type="button"
            data-ocid="menu.add_to_cart.primary_button"
            className="flex-1 h-11 font-semibold text-base"
            onClick={handleAdd}
          >
            Add to cart · {formatCents(totalCents)}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Menu Item Card ────────────────────────────────────────────────────────────

function MenuItemCard({
  item,
  index,
  onAddToCart,
}: {
  item: MenuItem;
  index: number;
  onAddToCart: (item: MenuItem) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border overflow-hidden flex hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
      data-ocid={`menu.item.${index + 1}`}
    >
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-base text-foreground mb-1 truncate">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-bold text-primary text-base">
            {formatCents(item.priceCents)}
          </span>
          <button
            type="button"
            data-ocid={`menu.add_button.${index + 1}`}
            onClick={() => onAddToCart(item)}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-smooth shadow-sm shrink-0"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image */}
      {item.imageUrl && (
        <div className="w-28 h-auto shrink-0 bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </motion.div>
  );
}

// ── Floating Cart Bar ─────────────────────────────────────────────────────────

function FloatingCartBar({
  itemCount,
  subtotalCents,
}: {
  itemCount: number;
  subtotalCents: number;
}) {
  const navigate = useNavigate();
  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cart-bar"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 35 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm"
        data-ocid="cart.floating_bar"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/cart" })}
          data-ocid="cart.floating_bar.link"
          className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-elevated hover:opacity-95 transition-smooth"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 rounded-xl px-2.5 py-1 text-sm font-bold">
              {itemCount}
            </div>
            <span className="font-semibold">View Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{formatCents(subtotalCents)}</span>
            <ShoppingCart className="w-4 h-4" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function RestaurantPage() {
  const { restaurantId } = useParams({ from: "/restaurants/$restaurantId" });
  const navigate = useNavigate();
  const restaurantIdBigInt = useMemo(() => {
    try {
      return BigInt(restaurantId);
    } catch {
      return null;
    }
  }, [restaurantId]);

  const { data: restaurant, isLoading: restaurantLoading } =
    useGetRestaurant(restaurantIdBigInt);
  const { data: menuItems, isLoading: itemsLoading } =
    useGetMenuItems(restaurantIdBigInt);
  const { itemCount, subtotalCents } = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const grouped = useMemo(() => {
    if (!menuItems) return {};
    return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const categories = useMemo(() => Object.keys(grouped), [grouped]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  function scrollToCategory(cat: string) {
    setActiveCategory(cat);
    const el = categoryRefs.current[cat];
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const isLoading = restaurantLoading || itemsLoading;

  return (
    <Layout>
      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button
          type="button"
          data-ocid="restaurant.back_button"
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to restaurants
        </button>
      </div>

      {/* Hero header */}
      {(restaurantLoading || restaurant) && (
        <div className="relative w-full h-56 sm:h-72 bg-muted overflow-hidden">
          {restaurant?.imageUrl && (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              data-ocid="restaurant.hero_image"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {restaurant && (
            <div
              className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-5"
              data-ocid="restaurant.header"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-3xl text-white mb-1 leading-tight">
                    {restaurant.name}
                  </h1>
                  <p className="text-white/80 text-sm">{restaurant.cuisine}</p>
                </div>
                <Badge
                  className={
                    restaurant.isOpen
                      ? "shrink-0 text-xs font-semibold px-2.5 py-1 bg-emerald-500 text-white border-0"
                      : "shrink-0 text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground"
                  }
                  data-ocid="restaurant.status_badge"
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restaurant meta row */}
      {restaurant && (
        <div
          className="bg-card border-b border-border"
          data-ocid="restaurant.meta_row"
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>{Number(restaurant.deliveryTimeMinutes)} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" />
              <span>
                {Number(restaurant.deliveryFeecents) === 0
                  ? "Free delivery"
                  : `${formatCents(restaurant.deliveryFeecents)} delivery`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category sticky nav */}
      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelect={scrollToCategory}
        />
      )}

      {/* Menu sections */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {isLoading ? (
          <div className="space-y-3" data-ocid="restaurant.menu.loading_state">
            {[0, 1, 2, 3, 4].map((i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="restaurant.menu.empty_state"
          >
            <p className="text-4xl mb-4">🍽️</p>
            <h3 className="font-semibold text-lg mb-2">No menu items yet</h3>
            <p className="text-sm text-muted-foreground">
              This restaurant hasn't added their menu yet.
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <section
              key={cat}
              ref={(el) => {
                categoryRefs.current[cat] = el;
              }}
              className="mb-10"
              data-ocid="restaurant.menu_section"
            >
              <h2 className="font-display font-bold text-xl mb-4 text-foreground">
                {cat}
              </h2>
              <div className="space-y-3">
                {grouped[cat].map((item, i) => (
                  <MenuItemCard
                    key={item.id.toString()}
                    item={item}
                    index={i}
                    onAddToCart={setSelectedItem}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Add to cart sheet */}
      <AddToCartSheet
        item={selectedItem}
        restaurantId={restaurantIdBigInt ?? BigInt(0)}
        restaurantName={restaurant?.name ?? ""}
        onClose={() => setSelectedItem(null)}
      />

      {/* Floating cart bar */}
      <FloatingCartBar itemCount={itemCount} subtotalCents={subtotalCents} />
    </Layout>
  );
}
