import { useState,useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated,signout } from '../auth'
import { useParams,useNavigate } from 'react-router-dom'
import {read,deleteUser,update,updateUser} from "./apiUser"
import Swal from 'sweetalert2'
const Profile = ()=>{
  // state
    const [data,setData] = useState({
      name:'',
      email:"",
      password:"",
      error: '',
      success : '',
    })
    // state for show/hide password
    const [showPassword, setShowPassword] = useState(false);
    // logic for show/hide password
    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => (
        !prevShowPassword
      ));
    }; 
    // destructureing
    const {token} = isAuthenticated()
    const {userId} = useParams()
    const navigate = useNavigate()
   const {name,email,password,error,success} = data
    // functions
   const init =  ()=> {
    read(userId,token).then(res=>{
      if(res.error){
        // console.log(error)
        setData({...data,error:res.error})
      }
      else{
        // console.log(res)
        setData((prev)=>({...prev,name:res.name,email:res.email}))
      }
    })
   }
// useEffect 
   useEffect(()=>{
    init()
   },[])
// functions for handling user interactions
   const handleChange = (name)=>e=>{
    setData({...data,error:false,[name]:e.target.value})
   }
   const handleSubmit = (e)=>{
    e.preventDefault()
    update(userId,token,{name,email,password}).then(res=>{
      if(res.error){
        // setData((prev)=>({...prev,error:res.error}))
        console.log(res.error)
      }
      else{
        updateUser(res,()=>{
          console.log(res)
          Swal.fire({
            title: 'Updated!',
            text: "_Name:"+res.name+"_Email:"+res.email,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        })
        
      }
    })
   }
   const destroyUser = ()=>{
    Swal.fire({
      title: 'Delete your account?',
      text: 'action can not be undone',
      icon: 'warning',
      confirmButtonText: 'Delete'
    }).then(res => {
      if (res.isConfirmed) {
        deleteUser(userId,token).then(data=>{
          if(data.error){
            console.log(data.error)
          }
          else{
            Swal.fire({
              title: 'Account Deleted succesfuly',
              text: data.msg,
              icon: 'success',
              confirmButtonText: 'ok'
            }).then(res=>{
              if(res.isConfirmed){
                signout(()=>{
                  alert("signed out succesful")
                })
              }
            })
          }
        })
      }
    });
      
   }

  //  UI
   const profileUpdateForm = (name,email)=>{
    return(
      <div className='w100 p-1 bg-slate-200 h80 text-2xl flex  flex-wrap'>
          <div className='flex-wrap w100 bg-slate-500 py-2 flex justify-center items-center border-2 border-white my-2'>
              <label className='font-black text-2xl px-2'>Name:</label>
              <input 
              type='text'
              className='w50 outline '
              value={name}
              onChange={handleChange('name')}
              />
          </div>
          <div className='flex-wrap w100 bg-slate-500 py-2 flex items-center justify-center border-2 border-white my-2'>
              <label className='font-black text-2xl px-2'>Email:</label>
              <input 
              type='text'
              className='w50 outline'
              value={email}
              onChange={handleChange('email')}
              />
          </div>
          <div className='w100 bg-slate-500 py-2 flex justify-center items-center flex-wrap border-2 border-white my-2'>
              <label className='font-black text-2xl px-2'>Password:</label>
              <input 
              type={showPassword ? 'text' : 'password'}
              className='w50 outline'
              value={password}
              onChange={handleChange('password')}
              />
              <button 
              className='bg-blue-400 rounded-xl p-1 text-white'
              onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
              </button>
          </div>
          <div className='w100 bg-slate-500 py-2 flex justify-center border-2 border-white my-2' >
            <button 
            className='bg-green-500 text-white rounded-xl p-1'
            onClick={handleSubmit}
            >
                Save Changes
            </button>
          </div>
          {deleteAccount()}
      </div>
    )
   }
   const deleteAccount = ()=>{
    return(
      <div className='w100 flex justify-center py-8'>
        <button 
        onClick={destroyUser}
        className='bg-red-600 text-white font-black text-2xl rounded-xl py-1 px-4'>
          Delete Your Account Permanently
        </button>
      </div>
    )
   }

   const showError = ()=>{
     return(
      <div>
        {error !==null && error !=="" && error !==false ?
         (
          <div className='w100 bg-red-500 text-4xl font-black text-white py-4 text-center'>
            {error}
          </div>
          )
         :
          null}
      </div>
     )
   }
   const showSuccess = ()=>{
    return(
      <div>
        {success !==null && success !=="" && success !==false ? 
        (
          <div className='w100 bg-green-500 text-4xl font-black text-white py-4 text-center'>
            {success}
          </div>
        )
        : 
        null}
      </div>
     )
   }

    return(
        <Layout title="Profile" description='Udpate you profile'>
                {showError()}
                {showSuccess()}
                {profileUpdateForm(name,email,password)}
                
                
        </Layout>
    )
}

export default Profile