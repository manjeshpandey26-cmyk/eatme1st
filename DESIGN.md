# Design Brief — Eatme1st

## Summary
Eatme1st is a customer-facing food delivery platform emphasizing speed, appetite appeal, and trust. Warm energetic palette (coral-orange primary) paired with deep navy secondary creates confidence and urgency. Card-based layout with color-coded order status tracking builds clarity and reliability.

## Tone & Aesthetic
Fast-paced, appetite-driven, friendly-professional. Warm optimistic energy (orange) tempered by reliable stability (navy). Rounded forms, generous spacing, modern typography for rapid scanning and decision-making.

## Differentiation
Color-coded order status badges (confirmed→yellow, preparing→orange, ready→green, in-transit→blue, delivered→emerald) provide instant visual tracking progress. Sticky search header with location awareness enables rapid restaurant discovery.

## Color Palette

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | 0.62 0.23 40 | CTAs, badges, highlights — warm coral-orange drives urgency |
| Secondary | 0.25 0 0 | Deep navy — trust, stability, footer, secondary text |
| Accent | 0.68 0.25 35 | Complement orange — status highlights, emphasis |
| Destructive | 0.55 0.24 25 | Cancel/remove actions — muted red-orange |
| Background | 0.99 0 0 | Light clean canvas for food imagery |
| Foreground | 0.18 0 0 | Dark readable text on light backgrounds |
| Muted | 0.92 0 0 | Secondary surfaces, disabled states |
| Border | 0.88 0 0 | Subtle dividers between content sections |

## Typography
- Display: Bricolage Grotesque (700–900 weights) — distinctive restaurant/brand names, order status headlines
- Body: DM Sans (400–500) — menu items, delivery details, instructions, readable at all sizes
- Mono: Geist Mono — tracking numbers, price displays, technical data

## Structural Zones

| Zone | Background | Treatment |
|------|------------|-----------|
| Header | White (bg-background) | Sticky, bottom border (border-border), search input with shadow-card |
| Restaurant Cards | White (bg-card) | Elevated shadow-card, rounded-lg, image + metadata + CTA |
| Menu Section | White (bg-background) | Card-grid layout, alternating bg-muted/30 for rhythm |
| Cart Drawer | White (bg-card) | Fixed sidebar or bottom drawer, shadow-elevated on desktop |
| Order Tracking | White (bg-card) | Color-coded status badges, progress timeline, large countdown timer |
| Footer | bg-secondary (0.25 0 0) | Deep navy, text-foreground inverted, center-aligned links |

## Spacing & Rhythm
Base unit 0.5rem (8px). Restaurants/menus use 1rem gaps. Cards have 1.5rem internal padding. Vertical rhythm via 0.5rem spacing grid creates breathing room without excess white space.

## Component Patterns
- Buttons: Primary (bg-primary, rounded-lg, shadow-sm on hover), Secondary (border-2, text-primary)
- Input: bg-input (0.92 0 0), border-border, focus:ring-2 ring-primary/50
- Badges: Status (badge-status-*), Rating (bg-yellow-100), Delivery (bg-blue-100)
- Cards: Restaurant/Menu cards use shadow-card + rounded-lg, hover:shadow-elevated
- Modals: Popover bg-popover (0.98 0 0), shadow-elevated, rounded-lg

## Motion
Transitions via transition-smooth (300ms cubic-bezier) on interactive elements. Order status updates animate via slide-in and fade. No bounce or excessive animations — restraint maintains professionalism.

## Constraints
- Max width 1400px for content. Mobile-first responsive breakpoints (sm: 640px, md: 768px, lg: 1024px)
- No gradients or glassmorphism — flat modern aesthetic
- Status badges always use semantic colors (yellow/orange/green/blue/emerald) for accessibility
- Images scale responsively, never distort food photography
- Text contrast ≥ 4.5:1 against all backgrounds

## Signature Detail
Color-coded order timeline: each status step has unique badge color matching delivery psychology (yellow=waiting/confirmed, orange=active/cooking, green=ready/success, blue=in-transit/movement, emerald=delivered/completion). Creates instant visual feedback on order progress without reading text.

