import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { getProducts } from './apiCore'
import Card from './Card'
import Search from './Search'


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
    <Layout title="Home Page" description="Homepage Ecommerce website "className='bg-gray-200'>
      <Search/>
      <p className='text-3xl text-center bg-blue-300 products-wrap'>Products by Arrival</p>
      <div className='flex justify-evenly flex-wrap '>
      {productsByArrival && productsByArrival.length > 0 ? productsByArrival.map((product,i)=>(
        <Card product={product} key={i}/>
      )):null}
      </div>
      
      <p className='text-3xl text-center bg-blue-300'>Products by Sell</p>
      <div className='flex justify-evenly flex-wrap products-wrap'>
      {productsBySell && productsBySell.length > 0 ? productsBySell.map((product,i)=>(
        <Card product={product} key={i}/>
      )): null}
      </div>
      </Layout>
    </>
  )
}

export default Home



