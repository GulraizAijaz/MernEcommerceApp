import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
// import { Link } from 'react-router-dom'
import { createCategory } from './apiAdmin'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const AddCategory = ()=>{
    const Navigate = useNavigate()
    const [categoryName,setCategoryName] = useState('');
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
// Destructuring user and token from local storage
    const {user,token} = isAuthenticated()
// handle submut
    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log('submitted')
        // setError('')
        // setSuccess(false)
        // make request to api of create category 
        console.log('before making request to the backend',categoryName)
        createCategory(user._id,token,categoryName).then(data=>{
            if(data.error){
                setError(data.error)
            }
            else if(data.success){
                setError('')
                setSuccess(true)
                console.log("after api request createdd!!")
            }
            
            else{
                console.log()
            }
        })
        
    }
    const handlechange = (e)=>{
        setCategoryName(e.target.value)
    }

    // error component 
    useEffect(() => {
        if (error) {
          Swal.fire({
            title: 'Error!',
            text: error,
            icon: 'error',
            confirmButtonText: 'Try again'
          }).then(res => {
            if (res.isConfirmed) {
              setError(false)
              setSuccess(false)
            }
          });
        }
      }, [error]);

    //   success component  
    useEffect(() => {
        if (success) {
          Swal.fire({
            title: 'Success!',
            text: "category created wanna go back? or press ESC key to add more",
            icon: 'success',
            confirmButtonText: 'yes'
          }).then(res => {
            if (res.isConfirmed) {
              setError(false)
              setSuccess(false)
              Navigate('/admin/dashboard')
            }
          });
        }
      }, [success,Navigate]);
//  Create cateogry's form

    const newCategoryForm = ()=>{
        return(
            <form className='flex justify-center 100 bg-pink-400 ' onSubmit={handleSubmit}>
                <div className='bg-blue-300 w70 flex-col text-center'>
                    <h2 className='border border-black w-full  text-center text-3xl'>
                        Create Category
                    </h2>
                    <input  onChange={handlechange}
                    autoFocus
                    required
                    className='w100 py-2 text-xl m-4'
                    type='text'
                    value={categoryName}/>
                  
                    <button 
                    className='bg-cyan-400 p-4 rounded m-2'
                    >
                        Submit
                    </button>
                
                </div>
            </form>
        )
    }

    return(
    <Layout  title="Create new Category " description={`Hey ${user.name}, create new Cateogory today (-,-)`}
    className=''>
      {newCategoryForm()}
       {}
    </Layout>
    )
}

export default AddCategory