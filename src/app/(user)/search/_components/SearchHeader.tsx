interface SearchHeaderProps {
  query?: string;
}

export function SearchHeader({ query }: SearchHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
        {query ? (
          <span>
            Results for <span className="text-primary">"{query}"</span>
          </span>
        ) : (
          "Explore All Services"
        )}
      </h1>
    </div>
  );
}
