import { API } from "../config"

export const read = (userId,token)=>{
    return fetch(`${API}/user/${userId}`,{
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
        console.log(error)
        return error
    })
  }
export const update = (userId,token,user)=>{
    return fetch(`${API}/user/update/${userId}`,{
      method:"PUT",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json",
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify(user)
    })
    .then(response=> {
      return response.json()
    })
    .catch(error=> { 
        return error
    })
  }

 export const updateUser = (user,next)=>{
    if(typeof window !== "undefined"){
        if(localStorage.getItem('jwt')){
            let auth = JSON.parse(localStorage.getItem('jwt'))
            auth.user = user
            localStorage.setItem("jwt",JSON.stringify(auth))
            next()
        }
    }
  }

  export const deleteUser = (userId,token)=>{
    return fetch(`${API}/user/remove/${userId}`,{
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