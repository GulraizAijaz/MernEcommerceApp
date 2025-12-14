import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { getProducts } from './apiCore'
import Search from './Search'
import ProductGrid from './productGrid'
import { RiLoader4Fill } from "react-icons/ri";

const Home = () => {
  // products state
  const[productsBySell,setProductsBySell] = useState([])
  const[productsByArrival,setProductsByArrival] = useState([])
  
  // errorss state
  const[errorSold,setErrorSold] = useState(false)
  const[errorLatest,setErrorLatest] = useState(false)
  // loadings state
  const[loadingLatest,setLoadingLatest] = useState(false)
  const[loadingSold,setLoadingSold] = useState(false)
  

  const loader = ()=>{
    return(
      <div className='loader-wrap'>
        <RiLoader4Fill />
      </div>
    )
  }
  const loadProductsBySell = ()=>{
    setLoadingSold(true)
    getProducts('sold').then(data=>{
      if(data.error){
        setProductsBySell([])
        setErrorSold(true)
      }
      else{
        setProductsBySell(data)
        // console.log('success from frontend',data)
      }
    })
    .catch(err=>{
      setErrorSold(true)
    })
    .finally(()=>{
      setLoadingSold(false)
    })
  }
  const loadProductsByArrival = ()=>{
    setLoadingLatest(true)
    getProducts('createdAt').then(data=>{
      if(data.error){
        setProductsByArrival([])
        setErrorLatest(true)
        console.log('error from frontend',data)
      }
      else{
        setErrorLatest(false)
        setProductsByArrival(data)
        // console.log('success from frontend',data)
      }
    })
    .catch(err=>{
      setErrorLatest(true)
    })
    .finally(()=>{
      setLoadingLatest(false)
    })
  }
  useEffect(()=>{
    loadProductsBySell()
    loadProductsByArrival()
  },[])



  return (
    <>
    <Layout title="Home Page" description="Homepage Ecommerce website "className='home_main'>
      <p className='text-3xl text-center product_sort_type mb-4'>Recent Added Items</p>
      {loadingLatest && 
      loader()
    }

      {errorLatest ? <h2 className='danger-bg flex justify-center mb-2 py-1'>Error Fetching</h2> :
      (
        <ProductGrid products={productsByArrival} />
      )
    }
  
      <p className='text-3xl text-center product_sort_type mb-4'>Most Sold Items</p>
      {loadingSold && 
        loader()
      }

      {errorSold ? <h2 className='danger-bg flex justify-center mb-2 py-1'>Error Fetching</h2> : 
      (
        <ProductGrid products={productsBySell} /> 
      )
      }
      </Layout>
    </>
  )
}

export default Home



