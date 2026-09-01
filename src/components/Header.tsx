import { CarFront } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-1 flex items-center w-full p-4 gap-3 bg-surface-primary text-primary-default shadow-default h-15">
        <CarFront className="w-6 h-6" />

        <h1 className="text-xl font-bold text-text-h">
            SoftGo
        </h1>
    </header>
  );
};
