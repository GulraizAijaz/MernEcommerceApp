import { useState,useEffect } from 'react'
import { getCategories,list } from './apiCore'
import ProductGrid from './produc-grid'


const Search = ()=>{
    const [data,setData] = useState({
        categories : [],
        category : '',
        search : '',
        result : [],
        searched : false,
        error: false

    })
    const {categories,category,search,result,searched} = data

    const loadCategories = ()=>{
        getCategories().then(res=>{
            if(res.error){
                console.log(res.error)
            }
            else{
               setData({...data,categories:res})
            }
        })
    }

    const handlechange = name => e =>{
        setData({...data,[name]:e.target.value,searched:false})
    }


    const searchData  = ()=>{
        list({search:search || undefined, category:category })
        .then(res=>{
            if(res.error){
                setData({...data,error:true})
            }
            else{
                setData({...data,error:false,result:res.products,searched:true})

            }
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        searchData()
    }

    const searchMessage = (searched,results)=>{
        if(searched && results.length > 0){
            return `Found ${results.length} Products`
        }
        if(searched && results.length < 1){
            return `No Products Found`
        }
    }

    const searchedProducts = (results=[])=>{
        return(
        <div className='w100'>
            <div className='text-4xl w100 font-black flex justify-center bg-gray-700 text-red-500'>
            {searchMessage(searched,result)}
            </div>

            <ProductGrid products={result} /> 
        </div>
        )
    }
    useEffect(()=>{
        loadCategories()
    },[])

    const searchForm = ()=>(
        
            <form onSubmit={handleSubmit} className='w100 py-6  flex justify-center items-center flex-wrap search_form box_style mb-4'>
            <div className='w100 flex justify-center pb-6 search_title'>
                <h2 className='text-2xl  rounded-full  font-bold '>
                    search products here
                </h2>
            </div>
            <div className='search_dets_wrap flex justify-center '>

                <select className='w20 py-2 pr-2 custom_border pl-3' onChange={handlechange("category")}>
                    <option value='All'>All Categories</option>
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
                value={search}
                onChange={handlechange("search")}
                />
                <button  className='p-2 text-2xl rounded custom_border'>search</button>
            </div>
        </form>
        
    )

    return(
        <>
        {searchForm()}
        <div className='w100 flex justify-evenly flex-wrap'>
            { 
            (
                <h1 className='w100 text-3xl text-center bg-blue-300 my-2'>Searched Results</h1>
            )&&
            result?searchedProducts(result) : null
            }
        </div>
        </>
    )
}

export default Search