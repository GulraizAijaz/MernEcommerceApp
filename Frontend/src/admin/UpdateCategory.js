import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
import {getCategory,updateCategory } from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UpdateCategory = ()=>{
    const [category,setCategory] = useState({})
    const [newName,setNewName] = useState()

    const [error,setError] = useState(false)
    const [success,setSuccess] = useState(false)
// Destructuring user and token from local storage
    const {user,token} = isAuthenticated()
    const {categoryId} = useParams()
    const loadCategory = (id)=>{
        getCategory(id).then(data=>{
            if(data.error){
                setError(data.error)
            }
            else{
                setCategory(data)
            }
        })
    }
    useEffect(()=>{
        loadCategory(categoryId)
    },[])
    const handleChange = (e)=>{
        setNewName(e.target.value)
        
    }
    const handleSubmit = ()=>{
        Swal.fire({
            title: 'Update?!',
            text: "Action Cannot be Undone",
            icon: 'warning',
            confirmButtonText: 'Confirm'
          }).then(res => {
            if (res.isConfirmed) {
                updateCategory(user._id,token,newName,categoryId).then(data=>{
                    if(data.error){
                        setError(data.error)
                    }
                    else{
                        setSuccess(data.msg)
                        setError(false)
                    }
                   })
            }
          });
       
    }
    const showError = (e)=>{
        return (
            <div className='w100'>
                {
                    e && (
                        <div className='w100 bg-red-500 text-4xl font-black'>
                            <h1>Error :{e}</h1>
                        </div>
                    )
                }
            </div>
        )
    }
    const showSuccess = (s)=>{
        return (
            <div className='w100'>
                {
                    s && (
                        <div className='w100 bg-green-500 text-4xl font-black'>
                            <h1>Success :{s}</h1>
                        </div>
                    )
                }
            </div>
        )
    }


    return(
    <Layout  title="Update" description={`Update This Category`}
    className=''>
        <div className='w100'>
        {showError(error)}
        {showSuccess(success)}
        </div>
        <div className='w100 flex justify-center'>
            <div className=' text-center w70 bg-yellow-200 text-2xl flex flex-col justify-center items-center py-4'>
                <h1>Current Name</h1>
                <h1 className='bg-green-500 p-2 rounded-xl'>{category.name}</h1>
                <h1 className=' p-1 rounded-xl my-2'>Set New Name</h1>
               <input 
               onChange={handleChange}
               placeholder='Add Name'
               className='text-center my-2 rounded-xl bg-black text-white py-2' type='text' 
               />
               <h1 className='bg-gray-400'>Created : {moment(category.createdAt).fromNow()}</h1>
               <h1 className='bg-gray-400'>updated : {moment(category.updatedAt).fromNow()}</h1>
               <button 
               onClick={handleSubmit}
               className='bg-yellow-500 border-2 border-red p-2 rounded-xl my-2'>
                    Update
                </button>
                {JSON.stringify(newName)}
            </div>
        </div>
    </Layout>
    )
}

export default UpdateCategory