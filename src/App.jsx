import { useEffect, useState } from 'react'

function App() {

  const [query, setQuery] = useState('');
  const [productSugg, setProductSugg] = useState([]);


  useEffect(() => {
    if (!query.trim()) {
      setProductSugg([]);
      return;
    }
    fetch("http://localhost:3333/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setProductSugg(filtered);
      })
      .catch(error => console.error(error));
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
