import Link from "next/link";

export function UserNavbarLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-0.5 text-2xl font-black tracking-tight text-foreground shrink-0"
    >
      fiverr
      <span className="text-emerald-500 text-3xl leading-none">.</span>
    </Link>
  );
}
