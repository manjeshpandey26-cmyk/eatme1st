import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChefHat,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

function Header() {
  const { isAuthenticated, login, logout, shortPrincipal, isLoading } =
    useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/orders", label: "My Orders" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-sm"
      data-ocid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            data-ocid="header.logo_link"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Eatme<span className="text-primary">1st</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="header.nav"
          >
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} label={link.label} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Location pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">San Francisco, CA</span>
            </div>

            {/* Cart */}
            <Link to="/cart" data-ocid="header.cart_button">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/profile" data-ocid="header.profile_link">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-mono">{shortPrincipal}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Sign out"
                  data-ocid="header.logout_button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => login()}
                disabled={isLoading}
                size="sm"
                className="hidden sm:flex gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="header.login_button"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? "Connecting…" : "Sign In"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="header.mobile_menu_toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1"
          data-ocid="header.mobile_menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                data-ocid="header.mobile_logout_button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                className="w-full gap-2 bg-primary text-primary-foreground"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                data-ocid="header.mobile_login_button"
              >
                <LogIn className="w-4 h-4" />
                Sign In with Internet Identity
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const routerState = useRouterState();
  const isActive = routerState.location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );
  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      data-ocid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              Eatme<span className="text-primary">1st</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
