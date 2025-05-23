import { useEffect, useState } from 'react'

function App() {

  const [query, setQuery] = useState('');
  const [productSugg, setProductSugg] = useState([]);

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setProductSugg([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:3333/products");
      const data = await res.json();
      const filtered = data.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setProductSugg(filtered);
    } catch (error) {
      console.error("Errore nel fetch dei prodotti:", error);
    }
  };

  useEffect(() => {
    fetchProducts(query)
  }, [query]);

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
            <p key={product.id}>{product.name}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
