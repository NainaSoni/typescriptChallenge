import React from 'react';

interface SortDropdownProps {
    onSortChange: (sortKey: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
    return (
        <div className="sort-dropdown">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" onChange={(e) => onSortChange(e.target.value)}>
                <option value="">Select</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="color">Color</option>
            </select>
        </div>
    );
};

export default SortDropdown;