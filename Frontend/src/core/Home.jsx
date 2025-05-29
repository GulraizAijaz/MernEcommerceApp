import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { getProducts } from './apiCore'
import Search from './Search'
import ProductGrid from './produc-grid'

const Home = () => {
  const[productsBySell,setProductsBySell] = useState([])
  const[productsByArrival,setProductsByArrival] = useState([])
  const[error,setError] = useState(false)
  const {user} = isAuthenticated()

  const loadProductsBySell = ()=>{
    getProducts('sold').then(data=>{
      if(data.error){
        setError(data.error)
        setProductsBySell([])
        // console.log('error from frontend',data)
      }
      else{
        setProductsBySell(data)
        // console.log('success from frontend',data)
      }
    })
  }
  const loadProductsByArrival = ()=>{
    getProducts('createdAt').then(data=>{
      if(data.error){
        setError(data.error)
        setProductsByArrival([])
        // console.log('error from frontend',data)
      }
      else{
        setProductsByArrival(data)
        // console.log('success from frontend',data)
      }
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
      <ProductGrid products={productsByArrival} />
  
      <p className='text-3xl text-center product_sort_type mb-4'>Most Sold Items</p>
      <ProductGrid products={productsBySell} /> 
      </Layout>
    </>
  )
}

export default Home



