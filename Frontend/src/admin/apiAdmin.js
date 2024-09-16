import { API } from '../config'

export const createCategory = (userId,token,category)=>{
        return fetch(`${API}/category/create/${userId}`,{
          method:"POST",
          headers:{
            Accept :'application/json',
            "Content-Type":"application/json",
            Authorization : `Bearer ${token}`
          },
          body:JSON.stringify({name:category})
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
export const createProduct = (userId,token,form)=>{
        return fetch(`${API}/product/create/${userId}`,{
          method:"POST",
          headers:{
            Accept :'application/json',
            Authorization : `Bearer ${token}`
          },
          body: form
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

export const getCategories = ()=>{
  return fetch(`${API}/category/getcategories`,{
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
export const listOrders = (userId,token)=>{
  return fetch(`${API}/order/list/${userId}`,{
    method:"GET",
    headers:{
      Accept :'application/json',
      Authorization : `Bearer ${token}`
    },
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

export const getStatusValues = (userId,token)=>{
  return fetch(`${API}/order/status-value/${userId}`,{
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
export const updateOrderStatus = (userId,token,orderId,status)=>{
  return fetch(`${API}/order/${orderId}/status/${userId}`,{
    method:"PUT",
    headers:{
      Accept :'application/json',
      "Content-Type":"application/json",
      Authorization : `Bearer ${token}`
    },
    body: JSON.stringify({status,orderId})
  })
  .then(response=> {
    
    return response.json()
  })
  .catch(error=> {
      // console.log(error)
      return error
  })
}

// to perform crud on the products
// get all 
// get particular product
// update signle product
// delete single product

export const getProducts = ()=>{
  return fetch(`${API}/products?limit=20`,{
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

export const getProduct = (productId)=>{
  return fetch(`${API}/product/${productId}`,{
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

export const deleteProduct = (productId,userId,token)=>{
  return fetch(`${API}/product/delete/${productId}/${userId}`,{
    method:"DELETE",
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
export const updateProduct = (productId,userId,token,product)=>{
  return fetch(`${API}/product/update/${productId}/${userId}`,{
    method:"PUT",
    headers:{
      Accept :'application/json',
      Authorization : `Bearer ${token}`
    },
    body: product
  })
  .then(response=> {
    
    return response.json()
  })
  .catch(error=> {
      // console.log(error)
      return error
  })
}
export const getAllUsers = (userId,token)=>{
  return fetch(`${API}/users/all/${userId}`,{
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

export const getUser = (adminId,userId,token)=>{
  return fetch(`${API}/user/get/${adminId}/${userId}`,{
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
export const updateUser = (adminId,userId,token,updatedUser)=>{
  return fetch(`${API}/user/update/${adminId}/${userId}`,{
    method:"POST",
    headers:{
      Accept :'application/json',
      "Content-Type":"application/json",
      Authorization : `Bearer ${token}`
    },
    body:JSON.stringify(updatedUser)
  })
  .then(response=> {
    return response.json()
  })
  .catch(error=> {
      return error
  })
}
export const deleteUser = (adminId,userId,token)=>{
  return fetch(`${API}/user/delete/${adminId}/${userId}`,{
    method:"DELETE",
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
      return error
  })
}
