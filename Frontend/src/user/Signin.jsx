


import React, { useState ,useEffect} from 'react'
import Layout from '../core/Layout'
import {signin,authenticate,isAuthenticated} from "../auth/index"
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const {user} = isAuthenticated()
  const navigate = useNavigate()
  const [values ,setValues] = useState({
    email:'',
    password:'',
    error:'',
    success:false,
    msg:'',
    loading:false,
    redirectToRefferer: false
  })
  const { email, password, loading, redirectToRefferer, error, msg} = values
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  // password show and hide toggle
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };
  // signup fetch function
 
  // updating state after input field changes
  const handleChange = name => event =>{
    setValues({...values,[name]:event.target.value})
  }

  // submit form based on button click
  const handleSubmit = (e)=>{
    
    e.preventDefault()
      setValues({...values,error:false,loading:true})
      signin({email,password})
      .then(data=>{
        if(data.err){
          setValues({...values,error:true,success:false,loading:false,msg:data.error,})
          console.log( `error"${data}`)
        }
        else{
          setValues({...values,loading:true})
          authenticate(data, () => {
            setValues({
              ...values,
              redirectToRefferer: true,
              loading:false

            })
          });
        }
      })
      .catch(err => {
        console.error('Signin error:', err); // Log any errors
      });
      
    
  }
  // redirect to reffer
  useEffect(() => {
    if (redirectToRefferer) {
      if(user && user.role ===1){
        return navigate('/admin/dashboard')
      }
      else if(user && user.role ===0){
        return navigate('/user/dashboard')
      }
      else{
        return navigate('/')
      }
    }
  }, [redirectToRefferer, navigate]);

  // loading
 
  const showLoading = ()=>{
    return (
      <div>
        {loading ?
      <div className='flex justify-center font-black min-h-full bg-red-700 min-w-full items-center '>
       <h1 className='text-8xl'>loading... please wait</h1>
      </div>
      : 
     null
        }
      </div>
    );
  }
  
  // form component
  const signInForm = ()=>{
    return(
      <div  className="flex justify-center items-center w100 height-85vh signupformparent ">
        <form className='signupform w70' >
          <div>
          <p>
            E-mail
          </p>
          <input 
          required
           onChange={handleChange('email')}
          type="text"
          value={email} />
          </div>
          <div className='signuppass'>
          <p>
            Password
          </p>
          <input required
           onChange={handleChange('password')}
            type={showPassword.password ? 'text' : 'password'}
            value={password} />
            <button
              className='txt-s'
              type="button"
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword.password ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className='button'>
          <button onClick={handleSubmit}>Sign in</button>
          </div>
        </form>
    </div>
    )
  }
  // error component
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Try again'
      }).then(res => {
        if (res.isConfirmed) {
          setValues(v => ({ ...v, error: false, success: false }));
        }
      });
    }
  }, [error, msg]);
 
  return (
    <Layout  title="Log In " description="Log In to Ecommerce website "className=''>
      {showLoading()}
       {signInForm()}
    </Layout>
  )
}

export default Signin