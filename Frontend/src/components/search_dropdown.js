import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from '../core/apiCore';
import { SearchContext } from "../context/SearchContext";
const Search_dropdown = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { querySearched , setquerySearched , categoryIdContext , setCategoryIdContext } = useContext(SearchContext)

  // for loading categories initially
  useEffect(() => {
    loadCategories();
  }, []);



  const loadCategories = () => {
    getCategories().then(res => {
      if (res.error) {
        console.log(res.error);
      } else {
        setCategories(res);
      }
    });
  };

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(querySearched)}&categoryId=${encodeURIComponent(categoryIdContext)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search_dropdown">
      <select
        className='categories'
        onChange={(e) => setCategoryIdContext(e.target.value)}
        value={categoryIdContext}
      >
        <option value='all'>All Categories</option>
        {categories && categories.length > 0 && categories.map((c, i) => (
          <option key={i} value={c._id}>{c.name}</option>
        ))}
      </select>
      <input
        value={querySearched}
        onChange={(e) => setquerySearched(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Here..."
        type="text"
        className="search_input"
      />
      <button onClick={handleSearch} className="custom_btn search_btn">
        <span>Search</span>
      </button>
    </div>
  );
};

export default Search_dropdown;


