import React from 'react';
import './App.css';
import { ProductListContainer } from './components/productList';
function App() {
  return (
    <div className="App">
      
      <h1>Product List</h1>
     
      <main>
        <ProductListContainer />
      </main>
      <footer className="App-footer">
        <p>© 2023 Product List</p>
      </footer>
    </div>
  );
}

export default App;
