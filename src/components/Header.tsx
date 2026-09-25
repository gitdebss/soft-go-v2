import { CarFront, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "./Avatar";
import { LinkButton } from "./LinkButton";
import { getInitials } from "../utils/getInitials";

const NAV_LINKS = [
  { label: "Início", to: "/" },
  { label: "Minhas Corridas", to: "/my-rides" },
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-1 flex items-center justify-between w-full px-4 py-3 gap-4 bg-surface-primary text-primary-default border-b border-border-default h-16">
      <div className="flex items-center gap-6 min-w-0">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <CarFront className="w-6 h-6" />
          <h1 className="text-xl font-bold text-text-h hidden sm:block">SoftGo</h1>
        </Link>

        <nav className="min-w-0">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary-default/10 text-primary-default"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-primary-default"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {isAuthenticated && user ? (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Menu da conta"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="block rounded-full hover:opacity-80 transition-opacity"
          >
            <Avatar initials={getInitials(user.name)} />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-border-default bg-surface-primary shadow-default overflow-hidden"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-28">
          <LinkButton
            label="Entrar"
            style="primary"
            url="/login"
            isRouterLink
          />
        </div>
      )}
    </header>
  );
};
