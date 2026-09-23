import { CarFront, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "./Avatar";
import { LinkButton } from "./LinkButton";
import { getInitials } from "../utils/getInitials";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-1 flex items-center justify-between w-full p-4 gap-3 bg-surface-primary text-primary-default shadow-default h-15">
        <div className="flex items-center gap-3">
          <CarFront className="w-6 h-6" onClick={() => navigate("/")} />

          <h1 className="text-xl font-bold text-text-h">
              SoftGo
          </h1>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Avatar initials={getInitials(user.name)} />
            <button
              type="button"
              aria-label="Sair"
              onClick={handleLogout}
              className="text-text-secondary hover:opacity-80 transition-opacity"
            >
              <LogOut className="w-5 h-5" />
            </button>
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
