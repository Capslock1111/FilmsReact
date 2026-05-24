import { useContext } from "react";
import { SearchContext } from "./SearchContext";

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch должен использоваться внутри SearchProvider");
  }
  return context;
}
