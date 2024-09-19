import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth/index'
// import { Link } from 'react-router-dom'
import {deleteUser, getUser} from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate,useParams } from 'react-router-dom'


const DeleteUser = ()=>{
    // Destructuring user and token from local storage
    const {user,token} = isAuthenticated()
    // extract id from parametres 
    const {userId} = useParams()

    // state
    const [singleUser,setSingleUser] = useState({})
    



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

    
    const handleSubmit = ()=>{
        Swal.fire({
            title: 'Delete? Action cannot be undone!',
            text: "Are you sure want to Delete this user?",
            icon: 'warning',
            confirmButtonText: 'Yes'
          }).then(res => {
            if (res.isConfirmed) {
                deleteUser(user._id,userId,token).then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }
                    else{
                        console.log(data)
                        setSingleUser({})
                        Swal.fire({
                            title: 'User has Been deleted',
                            text: data.message,
                            icon: 'success',
                            confirmButtonText: 'ok'
                          })
                    }
                   })
            }
          });
       
    }


    return(
    <Layout  title="Delete this  User" description={` Delete this user permanently`}
    className=''>
        <div className='w100 bg-gray-200 text-xl flex justify-center h100'>
            <div className='bg-yellow-200 p-2 w70 '>
                <div className='my-1 bg-green-300 py-1 w100 flex justify-center text-2xl'>
                     <h1>
                        {
                        Object.keys(singleUser).length > 0 ?
                        singleUser.name :
                        "loading.."
                        }
                    </h1>
                </div>
                <div className='my-1 py-1 w100 flex justify-center text-2xl bg-green-300'>
                <h1>
                        {
                        Object.keys(singleUser).length > 0 ?
                        singleUser.role === 1 ? "Admin" : "Customer" :
                        "loading.."
                        }
                    </h1>
                </div>
                <div className='py-1 flex w100 justify-center'>
                    <button 
                    onClick={handleSubmit}
                    className='bg-red-800 py-2 px-1 rounded-xl text-white font-black'>
                        Delete This User
                    </button>
                </div>
            </div>
        </div>
    </Layout>
    )
}

export default DeleteUser