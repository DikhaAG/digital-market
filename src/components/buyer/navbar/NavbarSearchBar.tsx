import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface NavbarSearchBarProps {
  placeholder?: string;
  variant?: "desktop" | "mobile";
}

export function NavbarSearchBar({
  placeholder = "Temukan Layanan",
  variant = "desktop",
}: NavbarSearchBarProps) {
  if (variant === "mobile") {
    return (
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full h-10 border-input bg-background rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
      />
    );
  }

  return (
    <div className="flex items-center w-full border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
      <Input
        type="search"
        placeholder="What service are you looking for today?"
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 px-4 text-sm bg-transparent"
      />
      <Button
        size="icon"
        className="rounded-none h-10 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
