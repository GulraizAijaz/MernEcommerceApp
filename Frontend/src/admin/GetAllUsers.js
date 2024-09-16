import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
// import { Link } from 'react-router-dom'
import {getAllUsers } from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GetAllUsers = ()=>{
    const [users,setUsers] = useState([])

// Destructuring user and token from local storage
    const {user,token} = isAuthenticated()

    const loadUsers = (id,token)=>{
        getAllUsers(id,token).then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                setUsers(data)
            }
        })
    }
    useEffect(()=>{
        loadUsers(user._id,token)
    },[])


    return(
    <Layout  title="All Users" description={`Read Delete or Update Users`}
    className=''>
        <div className='w100 bg-red-200 flex justify-center'>
            <div className='w70 bg-green-200'>
                {
                    users.length > 0 && users.map((u,i)=>{
                        return(
                            <div 
                            key={i}
                            className='w100 bg-gray-400 my-2 text-2xl text-center'
                            >
                                <div className='w100 bg-green-600 flex justify-between px-4'>
                                    <Link to={`/admin/user/update/${u._id}`}>
                                    <EditIcon 
                                    className='bg-yellow-600 text-white '
                                    fontSize='large'/>
                                    </Link>
                                    <Link to={`/admin/user/delete/${u._id}`}>
                                    <DeleteIcon 
                                    className='bg-red-600 text-white '
                                    fontSize='large'/>
                                    </Link>
                                </div>
                                <h1 className='bg-red-400 font-black'>UserId:{u._id}</h1>
                                <h1 className='bg-yellow-200 font-black'>UserName:{u.name}</h1>
                                <h1 className='bg-yellow-200'>Email:{u.email}</h1>
                                <h1 className='bg-yellow-200'>UserRole:{u.role===1?"admin":"customer"}</h1>
                                <h1 className='bg-yellow-200'>Phone:{u.phone}</h1>
                                <h1 className='bg-yellow-200'>date of Birth:{u.dob}</h1>
                                <h1 className='bg-yellow-200'>days signup:{moment(u.createdAt).fromNow()}</h1>
                                <h1 className='bg-yellow-200'>updated date:{u.updatedAt}</h1>
                            </div>
                        )
                    }) 
                }
            </div>
        </div>
    </Layout>
    )
}

export default GetAllUsers