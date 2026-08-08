interface SearchHeaderProps {
  query?: string;
  totalResults: number;
}

export function SearchHeader({ query, totalResults }: SearchHeaderProps) {
  return (
    <div className="space-y-4 border-b border-border pb-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
        {query ? (
          <span>
            Hasil pencarian untuk{" "}
            <span className="text-primary">"{query}"</span>
          </span>
        ) : (
          "Semua Layanan Freelance"
        )}
      </h1>
      <p className="text-sm text-muted-foreground">
        Ditemukan {totalResults} layanan terverifikasi
      </p>
    </div>
  );
}
