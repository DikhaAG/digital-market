import Link from "next/link";

export interface NavLinkItem {
  label: string;
  href: string;
}

interface NavLinksGroupProps {
  title?: string;
  links: NavLinkItem[];
  onLinkClick?: () => void;
}

export function NavLinksGroup({
  title,
  links,
  onLinkClick,
}: NavLinksGroupProps) {
  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 pt-3 pb-1 font-bold text-foreground">{title}</div>
      )}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className="block hover:text-foreground hover:bg-muted transition-colors p-3 rounded-md"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
