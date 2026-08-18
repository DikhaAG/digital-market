interface SearchEmptyStateProps {
  query?: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 my-8">
      <h3 className="text-lg font-bold text-foreground">No services found</h3>
      <p className="text-muted-foreground text-sm mt-1">
        {query
          ? `Try adjusting your search or filters for "${query}".`
          : "Try adjusting your filter options to see more results."}
      </p>
    </div>
  );
}
