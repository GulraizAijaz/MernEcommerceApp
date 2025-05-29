import  { createContext,useState,useEffect} from 'react';
import { getSearchParams } from '../core/getSearchParams';
import { useLocation } from 'react-router-dom';

const SearchContext = createContext();


const SearchProvider = ({ children }) => {
    
    const location = useLocation()
    const {querySearch,categoryId} = getSearchParams(location.search)

    const [querySearched, setquerySearched] = useState(querySearch);
    const [categoryIdContext, setCategoryIdContext] = useState(categoryId);

    return (
    <SearchContext.Provider value={{ querySearched , setquerySearched , categoryIdContext , setCategoryIdContext }}>
        {children}
    </SearchContext.Provider>
    );
}

export { SearchContext, SearchProvider };