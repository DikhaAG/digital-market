export type SearchVariant = "desktop" | "mobile";

export interface SearchFormValues {
  q: string;
}

export interface NavbarSearchBarProps {
  placeholder?: string;
  variant?: SearchVariant;
  className?: string;
}

export interface GigSuggestion {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  startingPrice: number;
  category: { name: string };
}

export interface SuggestionItemProps {
  gig: GigSuggestion;
  onSelect: () => void;
}

export interface SearchPopoverProps {
  isLoading: boolean;
  suggestions: GigSuggestion[];
  debouncedQuery: string;
  onClose: () => void;
  onSubmit: () => void;
}
