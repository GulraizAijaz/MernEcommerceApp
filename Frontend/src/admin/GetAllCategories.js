import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
import {getCategories } from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GetAllCategories = ()=>{
    const [categories,setCategories] = useState([])
    const [error,setError] = useState(false)
// Destructuring user and token from local storage
    const {user,token} = isAuthenticated()

    const loadCategories = ()=>{
       getCategories().then(data=>{
        if(data.error){
            setError(data.error)
        }
        else{
            setCategories(data)
        }
       })
    }
    useEffect(()=>{
        loadCategories()
    },[])


    return(
    <Layout  title="All Categories" description={`Read Delete or Update Categories`}
    className=''>
        <div className='w100 bg-red-200 flex justify-center'>
            <div className='w70 bg-green-200'>
                {
                    categories.length > 0 && categories.map((c,i)=>{
                        return(
                            <div 
                            key={i}
                            className='w100 bg-gray-400 my-2 text-2xl text-center'
                            >
                                <div className='w100 bg-green-600 flex justify-between px-4'>
                                    <Link to={`/admin/category/update/${c._id}`}>
                                    <EditIcon 
                                    className='bg-yellow-600 text-white '
                                    fontSize='large'/>
                                    </Link>
                                    
                                    <Link to={`/admin/category/delete/${c._id}`}>
                                    <DeleteIcon 
                                    className='bg-red-600 text-white '
                                    fontSize='large'/>
                                    </Link>
                                </div>
                                <h1 className='bg-yellow-200 font-black'>Category Name : {c.name}</h1>
                                
                                <h1 className='bg-yellow-200'>days signup:{moment(c.createdAt).fromNow()}</h1>
                                <h1 className='bg-yellow-200'>updated date:{moment(c.updatedAt).fromNow()}</h1>
                            </div>
                        )
                    }) 
                }
            </div>
        </div>
    </Layout>
    )
}

export default GetAllCategories