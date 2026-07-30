import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-0.5 text-2xl font-black tracking-tight text-foreground shrink-0 transition-opacity hover:opacity-90"
    >
      fiverr
      {/* Menggunakan text-primary dari preset shadcn */}
      <span className="text-primary text-3xl leading-none">.</span>
    </Link>
  );
}
