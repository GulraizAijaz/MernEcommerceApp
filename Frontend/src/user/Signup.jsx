import React, { useState } from 'react'
import Layout from '../core/Layout'
import {signup} from "../auth/index"
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
  const navigate = useNavigate()
  const [values ,setValues] = useState({
    name:'',
    email:'',
    password:'',
    confirmpassword:'',
    phone:'',
    dob:'',
    error:'',
    success:false,
    msg:''
  })
  const {name,email,password,phone,dob} = values
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
    setValues({...values,error:false,[name]:event.target.value})
  }

  // submit form based on button click
  const handleSubmit = (e)=>{
    
    e.preventDefault()
    if(values.password !== values.confirmpassword){
      alert("pass and confirm pass aren't not same")
      
    }
    else{
      signup({name,email,password,phone,dob})
      .then(data=>{
        if(data.error){
          setValues({...values,error:true,success:false,msg:data.error,})
          console.log( `error"${data}`)
        }
        else{
          console.log(`succes${data}`)
          setValues({
            ...values,
            name:"",
            email:"",
            password:"",
            confirmpassword:"",
            phone:"",
            dob:"",
            error:"",
            success:true,
            msg:data
          })
         
          
        }
      })
      .catch(err=> console.log(err))
      
    }
  }
  // form component
  const signUpForm = ()=>{
    return(
      <div  className="flex justify-center items-center w100 height-85vh signupformparent ">
        <form className='signupform w70' >
          <div>
          <p>
            Name
          </p>
          <input required
           onChange={handleChange('name')}
            type="text"
            value={name} />
          </div>
          <div>
          <p>
            E-mail
          </p>
          <input required
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
          <div className='signuppass'>
          <p>
            confirm Password
          </p>
          <input required
           onChange={handleChange('confirmpassword')}
           type={showPassword.confirmPassword ? 'text' : 'password'} />
            <button 
              className='txt-s'
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showPassword.confirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          </div>
          <div>
          <p>
            Phone no {  `(optional)`}
          </p>
          <input onChange={handleChange('phone')} type="number" />
          </div>
          <div>
          <p>
            date of birth
          </p>
          <input onChange={handleChange('dob')} type="date" />
          </div>
          <div className='button'>
          <button onClick={handleSubmit}>Sign Up</button>
          </div>
        </form>
    </div>
    )
  }
  // error component
  if(values.error){
    Swal.fire({
      title: 'Error!',
      text: values.msg,
      icon: 'error',
      confirmButtonText: 'try again'
    })
  }
  // succes component
  if(values.success){
    Swal.fire({
      title: 'Success!',
      text: 'sign up succesfull now Sign in?',
      icon: 'success',
      confirmButtonText: 'Sign In Now'
    }).then(res=>{
      if(res.isConfirmed){navigate('/signin')}
    })
  }
  return (
    <Layout  title="Sign up " description="Sign up to Ecommerce website "className=''>
       {signUpForm()}
       
       
    </Layout>
  )
}

export default Signup