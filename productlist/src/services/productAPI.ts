
export const searchProductByName = async (name: string): Promise<any> => {
    const baseUrl = 'https://dummyjson.com/products/search';
    try {   
        const response = await fetch(`${baseUrl}?q=${encodeURIComponent(name)}`);
        if (!response.ok) {         
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching product by name:', error);
        throw error;
    }
};


export const fetchProducts = async (limit: number = 10, skip: number = 0): Promise<any> => {
    const baseUrl = 'https://dummyjson.com/products';
    try {
        const response = await fetch(`${baseUrl}?limit=${limit}&skip=${skip}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};