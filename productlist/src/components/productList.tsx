import React from 'react';
import { fetchProducts, searchProductByName } from '../services/productAPI';   
import SearchBar from './searchBar';
import { useEffect, useState } from 'react';  
import './productList.css';
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
}
export const ProductListContainer: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    let itemsPerPage = 10;

    useEffect(() => {     
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts(itemsPerPage, (currentPage - 1) * itemsPerPage);
                setProducts(data.products);
                setTotalProducts(data.total); 
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }
    , [currentPage, itemsPerPage]);

    const handleSearch = async (query: string) => {
         if (!query) {
            setCurrentPage(1); // Reset to the first page if the search query is empty
            return;
        }
        try {
            setLoading(true);
            const data = await searchProductByName(query);
            setProducts(data.products);
            setTotalProducts(data.total || data.products.length);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalProducts / itemsPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return ( 
    <div>
        <SearchBar onSearch={handleSearch} />
        <ProductList products={products} />
        <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
            </button>
            <span>
                Page {currentPage} of {Math.ceil(totalProducts / itemsPerPage)}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalProducts / itemsPerPage)}>
                Next
            </button>
        </div>
    </div>);
}
export default ProductListContainer;    