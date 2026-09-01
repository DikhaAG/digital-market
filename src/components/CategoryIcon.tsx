import * as LucideIcons from "lucide-react";
import { Folder } from "lucide-react";
import { useMemo } from "react";

export function DynamicLucideIcon({
  name,
  className = "h-5 w-5",
  fallback: FallbackIcon = Folder,
}: {
  name?: string | null;
  className?: string;
  fallback?: React.ComponentType<{ className?: string }>;
}) {
  const IconComponent = useMemo(() => {
    if (!name || !name.trim()) return null;

    const trimmed = name.trim();
    // 1. Coba pencarian langsung
    if (LucideIcons[trimmed as keyof typeof LucideIcons]) {
      return LucideIcons[
        trimmed as keyof typeof LucideIcons
      ] as React.ComponentType<{ className?: string }>;
    }

    // 2. Format dari kebab-case (misal: "shopping-bag") ke PascalCase ("ShoppingBag")
    const pascalName = trimmed
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");

    if (LucideIcons[pascalName as keyof typeof LucideIcons]) {
      return LucideIcons[
        pascalName as keyof typeof LucideIcons
      ] as React.ComponentType<{ className?: string }>;
    }

    return null;
  }, [name]);

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  return <FallbackIcon className={className} />;
}
