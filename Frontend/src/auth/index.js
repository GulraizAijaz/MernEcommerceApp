import {API} from '../config'

export const signup = (user)=>{
    return fetch(`${API}/signup`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json"
      },
      body:JSON.stringify(user)
    })
    .then(response=> {
      console.log(response)
      return response.json()
    })
    // .catch(err=> console.log(err))
    
  }
export const signin = (user)=>{
    return fetch(`${API}/signin`,{
      method:"POST",
      headers:{
        Accept :'application/json',
        "Content-Type":"application/json"
      },
      body:JSON.stringify(user)
    })
    .then(response=> {
      // console.log(response)
      return response.json()
    })
    .catch(err=> {
        console.log(err)
        return err
    })
    
  }

  export const authenticate = (data, next) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('jwt', JSON.stringify(data));
      next();
    }
  };
  
  export const isAuthenticated = () => {
    if (typeof window == "undefined") return false;
    if(localStorage.getItem('jwt')){
      if(Object.keys(JSON.parse(localStorage.getItem('jwt'))).length < 1){
        localStorage.removeItem('jwt')
        return false
      }
      
      return JSON.parse(localStorage.getItem('jwt'))
    }
    else{
      return false
    }
  };
  
  export const signout =(next)=>{
    if(typeof window !== "undefined"){
      localStorage.removeItem('jwt')
      return fetch(`${API}/signout`,{
        method:"GET"
      })
      .then(res=>{
        next()
        console.log(`sign out success frontend-->${res}`)
      })
      .catch(error=>{
        console.log(error)
      })
    }
    
  } 