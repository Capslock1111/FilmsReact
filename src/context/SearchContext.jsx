import { createContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');

    const value = {
        searchQuery,
        setSearchQuery,
    };

    return (
        <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
    )
}
