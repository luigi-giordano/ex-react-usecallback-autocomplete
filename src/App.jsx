import { useCallback, useEffect, useState } from 'react'

const debounce = (callback, delay) => {
  let timeout;
  return (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

function App() {

  const [query, setQuery] = useState('');
  const [productSugg, setProductSugg] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setProductSugg([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:3333/products");
      const data = await res.json();
      const filteredName = data.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setProductSugg(filteredName);
      console.log('API');

    } catch (error) {
      console.error("Errore nel fetch dei prodotti:", error);
    }
  };

  const debounceFetchProducts = useCallback(
    debounce(fetchProducts, 500)
    , [])

  useEffect(() => {
    debounceFetchProducts(query)
  }, [query]);

  const fetchProductsDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:3333/products/${id}`);
      const data = await res.json();
      setSelectedProduct(data);
      setQuery('');
      setProductSugg([]);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1>Autocomplete</h1>
      <input
        type="text"
        placeholder='Cerca prodotto'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {productSugg.length > 0 && (
        <div className='dropdown'>
          {productSugg.map((product) => (
            <p key={product.id} onClick={() => fetchProductsDetails(product.id)}>{product.name}</p>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div className='card'>
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <p>{selectedProduct.description}</p>
          <p><strong>Prezzo:</strong>{selectedProduct.price}€ </p>
        </div>
      )}
    </div>
  )
}

export default App
