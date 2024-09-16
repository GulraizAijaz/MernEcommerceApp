import { useState,useEffect } from 'react'
import { getCategories,list } from './apiCore'
import Card from './Card'

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
            <div className='w100 flex justify-evenly flex-wrap bg-pink-300'>
            {results.map((p,i)=>(
                <Card product={p} key={i}/>
            ))}
            </div>
        </div>
        )
    }
    useEffect(()=>{
        loadCategories()
    },[])

    const searchForm = ()=>(
        
            <form onSubmit={handleSubmit} className='w100 bg-green-400 flex justify-center items-center py-2 flex-wrap '>
            <div className='w100 flex justify-center p-2 '>
                <h2 className='text-2xl bg-blue-500 rounded-full  font-black px-2'>
                    search products here
                </h2>
            </div>
                <select className='w20 py-2' onChange={handlechange("category")}>
                    <option value='All'>All Categories</option>
                    {
                        categories && categories.length > 0 && categories.map((c,i)=>(
                                <option key={i} value={c._id}>{c.name}</option>
                        ))
                    }
                </select>
                <input 
                type='text'
                className='w40 py-2 rounded mx-2'
                placeholder='search products'
                value={search}
                onChange={handlechange("search")}
                />
                <button  className='bg-blue-500 py-1 text-2xl rounded'>search</button>
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
            result?searchedProducts(result) :null
            }
        </div>
        </>
    )
}

export default Search