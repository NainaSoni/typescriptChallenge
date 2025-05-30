import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchProducts, searchProductByName } from '../services/productAPI';
import SearchBar from './searchBar';
import SortDropdown from './sortDropDown';
import './productList.css';
import './sortDropDown.css';

interface Product {
    id: number;
    title: string;
    price: number;
    images: string[];
    description: string;
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product.id} className="product-item">
                    <img src={product.images[0]} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ))}
        </div>
    );
};

export const ProductListContainer: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [sortKey, setSortKey] = useState<string>(''); // State for sorting
    const itemsPerPage = 10;

    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts(itemsPerPage, (currentPage - 1) * itemsPerPage);
                setProducts((prevProducts) => [...prevProducts, ...data.products]);
                setHasMore(data.products.length > 0);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    // Sort products whenever `sortKey` changes
    useEffect(() => {
        if (sortKey) {
            const sortedProducts = [...products];
            if (sortKey === 'price-asc') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortKey === 'price-desc') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (sortKey === 'color') {
                sortedProducts.sort((a, b) => a.title.localeCompare(b.title)); // Assuming color is part of the title
            }
            setProducts(sortedProducts);
        }
    }, [sortKey, products]);

    const handleSearch = async (query: string) => {
        if (!query) {
            setCurrentPage(1);
            return;
        }
        try {
            setLoading(true);
            const data = await searchProductByName(query);
            setProducts(data.products);
            setHasMore(false);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            <SortDropdown onSortChange={setSortKey} />
            <ProductList products={products} />
            <div ref={lastProductRef} style={{ height: '1px' }}></div>
            {loading && <div>Loading...</div>}
        </div>
    );
};