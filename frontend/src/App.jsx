import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import FeaturedComponentsSection from './components/FeaturedComponentsSection';
import OneProductSection from './components/OneProductSection';
import HowItWorkSection from './components/HowItWorkSection';
import NewsletterComponents from './components/NewsletterComponents';
import Footer from './components/Footer';
import { axiosInstance } from './utils/axios';


function App() {
  const mockMatches = [{
    takealot: {
      title: "Montego Classic - Adult Dog Food - 10kg",
      price: "R 319",
      image: "https://media.takealot.com/covers_images/435899ee12904f67be82003035e3b4ed/s-xlpreview.file",
      link: "https://www.takealot.com/montego-classic-adult-dog-food-10kg/PLID91413726"
    },
    amazon: {
      title: "Montego Classic Adult Dog Food 10 kg",
      price: "R 229.15",
      image: "https://m.media-amazon.com/images/I/715cAi6mzVL._AC_UL320_.jpg",
      link: "https://www.amazon.co.za/Montego-Classic-Adult-Dog-Food/dp/B08NSTN8NT/ref=sr_1_2"
    }
  }];

  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featureProduct, setFeatureProduct] = useState(mockMatches[0]);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/compare?query=${query}`);
      console.log("Response data:", res.data);
      setMatches(Array.isArray(res.data.matches) ? res.data.matches.slice(0, 3) : []);
      setQuery("")
    } catch (error) {
      console.log("Error", error)
      alert("Failed to fetch comparison data")
    }
    setLoading(false)
  }

  return (
    <div className="background">
      <Navbar />
      <HeroSection setQuery={setQuery} handleSubmit={handleSubmit} query={query} />
      <FeaturedComponentsSection loading={loading} setFeatureProduct={setFeatureProduct} matches={matches} setMatches={setMatches} featureProduct={featureProduct}/>
      <OneProductSection featureProduct={featureProduct} loading={loading}/>
      <HowItWorkSection />
      <NewsletterComponents /> 
      <Footer /> 
    </div>
  );
}


export default App
