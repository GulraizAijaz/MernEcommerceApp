import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { getCategories,getFilteredProducts } from './apiCore'
import CheckboxCategories from './CheckboxCategories'
import {prices} from './fixedPrices'
import CheckboxPrices from './CheckboxPrices'
import ProductGrid from './productGrid'

const Shop = ()=>{
    const [myFilters,setMyFilters] = useState({
        filters:{category:[],price:[]}
    })

    const [filterOpen,setFilterOpen] = useState(false)
    const [categories,setCategories] = useState([])
    const [error,setError] = useState(false)
    const [limit,setLimit] = useState(20)
    const [skip,setSkip] = useState(0)
    const [size,setSize] = useState(0)
    const [filteredResults,setFilteredResults] = useState([])
    let user = ""
    isAuthenticated() ? user = isAuthenticated().user.name : user = 'But sign in First 😁'
    
    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
        !filterOpen ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')
    };
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
            <div className='w100 flex justify-center py-5 load_more_btn_wrap'>
                <button
                onClick={loadMore}
                className='p-3 rounded-full text-white custom_btn'>
                    <span>Load More Products</span>
                </button>
            </div>
            )
        );
    }

    useEffect(()=>{
        init()
        loadFilterResults(myFilters.filters)
    },[])

    const handleFilters = (filters,filterBy)=>{
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters 
        if(filterBy == 'price'){
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues
        }
        loadFilterResults(newFilters.filters)
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
        className='shop_page'
        description={`Lets do some shopping today (${user})`}
        >
        <div className='w-full flex justify-between flex-wrap inner_wrapper'>
            <button onClick={toggleFilter} id='open_filters' className='mobile_filter_icon' style={{display: filterOpen ? 'none' : ""}}>
                filters
            </button>
            <div className={`filters_wrap ${filterOpen ? 'open' : ""}`}>
                <button onClick={toggleFilter} className='close_icon_filters'>
                    X
                </button>
                <p className='custom_heading'>Filter Products By Categories</p>
                <ul className='filters_list'>
                    <CheckboxCategories categories={categories}
                    handleFilters={filters=>
                        handleFilters(filters,'category')
                        }
                    />
                </ul>
                <p className='custom_heading'>Filter Products By price ranges</p>
                    <div className='filters_list'>
                        <CheckboxPrices
                        prices={prices} 
                        handleFilters={filters=>
                            handleFilters(filters,'price')
                            }
                       
                    />
                    </div>
            </div>
             <ProductGrid products={filteredResults} >
                {loadMoreBtn()}
             </ProductGrid>

            
        </div>
        </Layout>

    )
}

export default Shop