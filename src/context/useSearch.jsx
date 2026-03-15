import { useContext, useState } from "react";
import { SearchContext } from './SearchContext';


export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new error('useSearch должен использоваться внутри SearchProvider');
    }
    return context;
}