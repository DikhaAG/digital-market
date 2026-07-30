import * as Icons from "lucide-react";
import { Folder } from "lucide-react";
import React from "react";

export type CategoryIconProps = Omit<Icons.LucideProps, "name"> & {
  name?: string | null;
};

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  if (!name) return <Folder {...props} />;

  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<Icons.LucideProps>>
  )[name];

  if (!IconComponent) {
    return <Folder {...props} />; // Fallback jika nama icon tidak ditemukan
  }

  return <IconComponent {...props} />;
}
