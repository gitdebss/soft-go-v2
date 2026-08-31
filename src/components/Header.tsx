import { Car } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-1 flex items-center w-full p-4 gap-3 bg-container-bg shadow-default h-15">
        <span className="flex items-center justify-center w-7 h-7 rounded bg-accent-bg">
            <Car className="w-4 h-4 text-container-bg" />
        </span>

        <h1 className="text-xl font-bold text-text-h">
            SoftGo
        </h1>
    </header>
  );
};
