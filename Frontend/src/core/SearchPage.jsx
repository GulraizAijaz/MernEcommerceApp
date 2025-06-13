import { useLocation, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import { list, getCategories } from '../core/apiCore';
import { useEffect, useState, useContext, useCallback } from 'react';
import ProductGrid from './produc-grid';
import {SearchContext} from '../context/SearchContext'
import { debounce } from './debounce';
const SearchPage = () => {
    // gathering the contexts required (query , caegory) and thier setters too!  
    const { querySearched , setquerySearched , categoryIdContext , setCategoryIdContext } = useContext(SearchContext)
    const [searchParams, setSearchParams] = useSearchParams();    
    const [data,setData] = useState({
        categories : [],
        category : categoryIdContext || "",
        search : querySearched || "",
        result : [],
        searched : false,
        error: false
    })
    const {categories,category,search,result,searched} = data
    
    const isEmptySearch = !querySearched && !categoryIdContext;


    // to load categories inititally
    useEffect(() => {
    loadCategories();
    debouncedSearch(querySearched,categoryIdContext)
    }, [searchParams]);

    const searchData  = (query="",catId="")=>{
        setData({...data,error:true,searched:false})
        query = query?.trim()
        list({search:query , category:catId })
        .then(res=>{
            if(res.error){
                setData({...data,error:true,searched:true})
            }
            else{
               setData(prev => ({
                ...prev,
                error: false,
                result: res.products,
                searched: true
                }));

            }
        })
        .catch(err=>console.log(err))
    }
    const debouncedSearch = useCallback(debounce(searchData, 200), []);

     const loadCategories = ()=>{
            getCategories().then(res=>{
                if(res.error){
                    console.log(res.error)
                }
                else{
                   setData(prev => ({
                        ...prev,
                        categories: res
                    }));
                }
            })
    }

    const noResults = ()=>{
        return(
            result.length < 1 && searched ?
            <div className='py-4 no-results results-wrap bg-red-600 text-white'>
                <h2 className='text-center text-4xl'>Oops!</h2>
                <p className='text-center text-2xl'>No Results Found</p>
                <p className='text-center text-xl'>Make sure to enter your desired product in search</p>
            </div>
            :
            ""
        )
    }
    const searchingProducts = ()=>{
        return(
            !searched  ?
            <div className='py-4 no-results results-wrap bg-yellow-600 text-white'>
                <h2 className='text-center text-4xl'>Searching Products.......</h2>
                <p className='text-center text-2xl'>PLEASE WAIT</p>
            </div>
            :
            ""
        )
    }
    const Results = (products)=>{
        return(
            products.length > 0 ?
            <div>
                <div className='py-4 results_dets results-wrap'>
                    {querySearched && 
                    (
                        (<h2 className='text-2xl text-center bg-bg1'> Search Terms : {querySearched}</h2>)  
                    )
                    }
                    {categoryIdContext &&
                        (<h2 className='text-2xl text-center bg-bg1'>Selected Category :  
                         {categories?.find(c => c._id === categoryIdContext)?.name || ""}
                        </h2>)
                    }
                    
                </div>
                <ProductGrid products={products} />
            </div>
            :
            ""
        )
    }
        // handle keydown for input
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
            handleSubmit(e);
            }
        };
        // handle function for search
        const handleSubmit = (e)=>{
            e.preventDefault()
            setSearchParams({
                query: querySearched,
                categoryId: categoryIdContext 
            });
            debouncedSearch(querySearched,categoryIdContext)
        }
    // ui search form row
        const searchForm = ()=>(

            <form onSubmit={handleSubmit} className='w100 py-6  flex justify-center items-center flex-wrap search_form box_style mb-4'>
            <div className='w100 flex justify-center pb-6 search_title'>
                <h2 className='text-2xl  rounded-full  font-bold'>
                    search products here
                </h2>
            </div>
            <div className='search_dets_wrap flex justify-center '>

                <select className='w20 py-2 pr-2 custom_border pl-3' onChange={(e)=>{setCategoryIdContext(e.target.value)}} value={categoryIdContext}>
                    <option value='all'>All Categories</option>
                    {
                        categories && categories.length > 0 && categories.map((c,i)=>(
                                <option key={i} value={c._id}>{c.name}</option>
                        ))
                    }
                </select>
                <input 
                type='text'
                className='w40 py-2 rounded pl-3 custom_border'
                placeholder='search products'
                value={querySearched}
                onChange={(e)=>{setquerySearched(e.target.value)}}
                onKeyDown={handleKeyDown}
                />
                <button  className='p-2 text-2xl rounded custom_border'>search</button>
            </div>
        </form>
        
    )


  return (
    <Layout title="Search Page" description="Search Products Here "className='search_main'>
    {searchingProducts()}
    {searchForm()}
    {noResults()}
    {Results(result)}
    </Layout>
  );
}

export default SearchPage