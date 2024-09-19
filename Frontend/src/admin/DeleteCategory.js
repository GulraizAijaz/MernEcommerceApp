import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
import {getCategory,deleteCategory } from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UpdateCategory = ()=>{
    const [category,setCategory] = useState({})

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
    const handleSubmit = ()=>{
        Swal.fire({
            title: 'Delete?!',
            text: "Action Cannot be Undone",
            icon: 'warning',
            confirmButtonText: 'Confirm'
          }).then(res => {
            if (res.isConfirmed) {
                deleteCategory(user._id,token,categoryId).then(data=>{
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


    return(
    <Layout  title="DELETE" description={`Delete This Category`}
    className=''>
        <div className='w100'>
            {showError(error)}
            {showSuccess(success)}
        </div>
        <div className='w100 flex justify-center'>
            <div className=' text-center w70 bg-yellow-200 text-2xl flex flex-col justify-center items-center py-4'>
                <h1>Current Name</h1>
                <h1 className='bg-green-500 p-2 rounded-xl'>{category.name}</h1>
               <h1 className='bg-gray-400 p-1 my-1 rounded-md'>Created : {moment(category.createdAt).fromNow()}</h1>
               <h1 className='bg-gray-400 p-1 my-1 rounded-md'>updated : {moment(category.updatedAt).fromNow()}</h1>
               <button 
               onClick={handleSubmit}
               className='bg-red-700 text-white border-2 border-black p-2 rounded-xl my-2'>
                    DELETE?
                </button>
                
            </div>
        </div>
    </Layout>
    )
}

export default UpdateCategory