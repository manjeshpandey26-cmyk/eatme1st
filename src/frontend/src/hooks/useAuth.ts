import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear, isAuthenticated } =
    useInternetIdentity();

  const isLoading = loginStatus === "logging-in";

  const principalText =
    isAuthenticated && identity ? identity.getPrincipal().toText() : null;

  // Shorten principal for display: first 5 + "..." + last 3
  const shortPrincipal = principalText
    ? `${principalText.slice(0, 5)}...${principalText.slice(-3)}`
    : null;

  return {
    identity,
    loginStatus,
    isAuthenticated,
    isLoading,
    login,
    logout: clear,
    principal: isAuthenticated && identity ? identity.getPrincipal() : null,
    principalText,
    shortPrincipal,
  };
}
