import { API } from "../config"
import queryString from "query-string"
export const getProducts = (sortBy)=>{
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=10`,{
      method:"GET",
    })
    .then(response=> {
      // console.log(response)
      return response.json()
    })
    .catch(error=> {
        console.log(error)
        return error
    })
  }

  export const getCategories = ()=>{
    return fetch(`${API}/category/getcategories`,{
      method:"GET",
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        console.log(error)
        return error
    })
    
  
  
  }

  export const getFilteredProducts = (skip,limit,filters={})=>{
    const data = {
      limit,
      skip,
      filters
    }
    return fetch(`${API}/products/by/search`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data)
    })
    .then(response=> {
      console.log(response)
      return response.json()
    })
    .catch(err=> {
      console.log(err)
        return err
    })
    
  }

  export const list = params=>{
    const query = queryString.stringify(params)
    console.log("queryy api core see ", query)
    return fetch(`${API}/products/search?${query}`,{
      method:"GET",
    })
    .then(response=> {
      console.log(response)
      return response.json()
    })
    .catch(error=> {
        console.log(error)
        return error
    })
  }

  export const readSingleProduct = (productId)=>{
    return fetch(`${API}/product/${productId}`,{
      method:"GET",
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        console.log(error)
        return error
    })
    
  
  
  }

  export const listRelated = (productId)=>{
    return fetch(`${API}/products/related/${productId}`,{
      method:"GET",
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
    
  
  
  }
  export const getBraintreeClientToken = (userId,token)=>{
    return fetch(`${API}/braintree/token/${userId}`,{
      method:"GET",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      },
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
  }


  export const processpayment = (userId,token,paymentData)=>{
    return fetch(`${API}/braintree/payment/${userId}`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      },
      body:JSON.stringify(paymentData)
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
  }
  export const createOrder = (userId,token,createOrderData)=>{
    return fetch(`${API}/order/create/${userId}`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      },
      body:JSON.stringify({order:createOrderData})
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
  }
  export const getPurchaseHistory = (userId,token)=>{
    return fetch(`${API}/orders/by/user/${userId}`,{
      method:"GET",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      }
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
  }
  export const createCodOrder = (userId,token,createOrderData)=>{
    return fetch(`${API}/order/create/cod/${userId}`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      },
      body:JSON.stringify({
        order:createOrderData
      })
    })
    .then(response=> {
      
      return response.json()
    })
    .catch(error=> {
        // console.log(error)
        return error
    })
  }
  