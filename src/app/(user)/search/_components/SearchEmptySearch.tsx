interface SearchEmptyStateProps {
  query?: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/30">
      <p className="text-muted-foreground text-sm">
        {query
          ? `Tidak ada layanan yang sesuai dengan kata kunci "${query}".`
          : "Belum ada layanan yang tersedia saat ini."}
      </p>
    </div>
  );
}
