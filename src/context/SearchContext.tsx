import { createContext, useState } from "react";
import { ReactNode } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface SearchProvideProps {
  children: ReactNode;
}
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: SearchProvideProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const value = {
    searchQuery,
    setSearchQuery,
  };

  return (
    <SearchContext.Provider value= { value } > { children } </SearchContext.Provider>
  );
}
