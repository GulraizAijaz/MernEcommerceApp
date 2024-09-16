import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
// import { Link } from 'react-router-dom'
import {getUser,updateUser} from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate,useParams } from 'react-router-dom'


const UpdateSingleUser = ()=>{
    // Destructuring user and token from local storage
    const {user,token} = isAuthenticated()
    // extract id from parametres 
    const {userId} = useParams()

    // state
    const [singleUser,setSingleUser] = useState({})
    const [updatedUser,setUpdatedUser] = useState({
        name :"",
        role :"",
    })



    const loadUser = (adminId,userId,token)=>{
        getUser(adminId,userId,token).then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                setSingleUser(data)
            }
        })
    }

    useEffect(()=>{
        loadUser(user._id,userId,token)
    },[])

    const handleChange = name => e => {
        setSingleUser({...singleUser, [name]:e.target.value})
        setUpdatedUser({...updatedUser, [name]:e.target.value})
    }
    const handleSubmit = ()=>{
        Swal.fire({
            title: 'Update?',
            text: "Are you sure want to update this user?",
            icon: 'warning',
            confirmButtonText: 'Yes'
          }).then(res => {
            if (res.isConfirmed) {
                updateUser(user._id,userId,token,updatedUser).then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }
                    else{
                        console.log(data)
                    }
                })
            }
          });
        
    }


    return(
    <Layout  title="Update this  User" description={` Update User`}
    className=''>
        {JSON.stringify(singleUser)}
        {JSON.stringify(updateUser)}
        <div className='w100 bg-gray-200 text-xl flex justify-center h100'>
            <div className='bg-yellow-200 p-2 w70 '>
                <div className='py-1 w100 flex justify-center'>
                    <label>Name:</label>
                    <input 
                    type='text'
                    value={
                        Object.keys(singleUser).length > 0 ?
                        singleUser.name :
                        "loading.."
                    }   
                    onChange={handleChange('name')}
                    />
                </div>
                <div className='py-1 w100 flex justify-center'>
                    <label>Role:</label>
                        <select
                        onChange={handleChange('role')} >
                            <option value='1'>Admin</option>
                            <option value="0">Customer</option>
                        </select>
                </div>
                <div className='py-1 flex w100 justify-center'>
                    <button 
                    onClick={handleSubmit}
                    className='bg-red-400 py-2 px-1 rounded-xl text-white font-black'>
                        Update This User
                    </button>
                </div>
            </div>
        </div>
    </Layout>
    )
}

export default UpdateSingleUser