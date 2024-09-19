import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import Card from './Card'
import { getCategories,getFilteredProducts } from './apiCore'
import CheckboxCategories from './CheckboxCategories'
import {prices} from './fixedPrices'
import CheckboxPrices from './CheckboxPrices'


const Shop = ()=>{

    const [myFilters,setMyFilters] = useState({
        filters:{category:[],price:[]}
    })
    const [categories,setCategories] = useState([])
    const [error,setError] = useState(false)
    const [limit,setLimit] = useState(20)
    const [skip,setSkip] = useState(0)
    const [size,setSize] = useState(0)
    const [filteredResults,setFilteredResults] = useState([])
    let user = ""
    isAuthenticated() ? user = isAuthenticated().user.name : user = "sign in to buy something"
    

    const init = ()=>{
        getCategories().then(res=>{
            if(res.error){
                setError(res.error)
            }
            else{
               setCategories(res)
            }
        })
    }

    const loadFilterResults = newFilters=>{
        getFilteredProducts(skip,limit,newFilters).then(data=>{
            if(data.error){
                setError(data.error)
            }
            else{
                setFilteredResults(data.products)
                setSize(data.size)
                setSkip(0)
            }
        })
    }
    const loadMore = () => {
        let toSkip = limit + skip
        getFilteredProducts(toSkip,limit,myFilters.filters).then(data=>{
            if(data.error){
                setError(data.error)
            }
            else{
                setFilteredResults([...filteredResults,...data.products])
                setSize(data.size)
                setSkip(0)
            }
        })
    }
    const loadMoreBtn = () => {
        return(
            size > 0 &&
            size >= limit && (
            <div className='w100 flex justify-center py-5'>
                <button
                onClick={loadMore}
                className='bg-orange-500 p-3 rounded-full text-white'>
                    Load More Products
                </button>
            </div>
            )
        );
    }

    useEffect(()=>{
        init()
    },[])

    const handleFilters = (filters,filterBy)=>{
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters 
        if(filterBy == 'price'){
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues
        }
        loadFilterResults(myFilters.filters)
        setMyFilters(newFilters)
    }
    const handlePrice = value => {
        const data = prices
        let array = []
        for(let key in data){
            if(data[key]._id === parseInt(value)){
                array = data[key].array
            }
        }
        return array
    }
    

    return(
        <Layout title='Shop page'
        description={`Lets do some shopping today (${user})`}
        >
        <div className='w100 flex justify-between flex-wrap'>
            <div className='w20 cart-product bg-green-500 '>
                <p className='text-2xl  px-2 font-black'>Filter Products By Categories</p>
                <ul className='px-2 bg-pink-400'>
                    <CheckboxCategories categories={categories}
                    handleFilters={filters=>
                        handleFilters(filters,'category')
                        }
                    />
                </ul>
                <p className='text-2xl  px-2 font-black'>Filter Products By price ranges</p>
                    <div className='bg-pink-400'>
                        <CheckboxPrices
                        prices={prices} 
                        handleFilters={filters=>
                            handleFilters(filters,'price')
                            }
                       
                    />
                    </div>
            </div>
            <div className='w80 cart-product bg-pink-300'>
            <div className='flex justify-evenly flex-wrap products-wrap'>
                {filteredResults.map((p,i)=>(
                    <Card product={p} key={i}/>
                ))} 
            </div>
                {loadMoreBtn()}
            </div>
        </div>
        </Layout>

    )
}

export default Shop