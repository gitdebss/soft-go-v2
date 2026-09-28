import { Home, Plus, Road } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MOBILE_NAV_LINKS = [
  { label: "Início", to: "/", icon: Home },
  { label: "Nova Carona", to: "/form-ride", icon: Plus },
  { label: "Minhas Corridas", to: "/my-rides", icon: Road },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação principal"
      className="sm:hidden fixed bottom-0 inset-x-0 z-1 flex items-stretch justify-around bg-surface-primary border-t border-border-default pb-[env(safe-area-inset-bottom)]"
    >
      {MOBILE_NAV_LINKS.map((link) => {
        const isActive = location.pathname === link.to;
        const Icon = link.icon;

        return (
          <Link
            key={link.to}
            to={link.to}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
              isActive
                ? "text-primary-default"
                : "text-text-secondary hover:text-primary-default"
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
