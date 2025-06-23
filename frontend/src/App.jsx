import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:3001/api/compare?query=${query}`);
      setResults(res.data);
    } catch (error) {
      console.log("Error", error)
      alert("Failed to fetch comparison data")
    }

    setLoading(false)
  }

  return (
    <div className='p-4'>
      <h1>Price Comparison</h1>
      <input type='text' placeholder='Search for a product' value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSubmit}>Compare</button>

      {loading && <p>Loading...</p>}

      <div>
        {results.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>{item.price}</p>
            <a href={item.link} target='_blank'>View</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
