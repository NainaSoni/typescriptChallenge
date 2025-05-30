import React, { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

   // Debounce logic: Update `debouncedQuery` after a delay when `searchQuery` changes
   useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
        clearTimeout(handler); // Clear timeout if `searchQuery` changes before delay ends
    };
}, [searchQuery]);

// Trigger search when `debouncedQuery` changes
useEffect(() => {
    onSearch(debouncedQuery);
}, [debouncedQuery, onSearch]);

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;