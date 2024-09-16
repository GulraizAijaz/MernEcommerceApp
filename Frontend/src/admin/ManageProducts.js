import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
// import { Link } from 'react-router-dom'
import { createCategory } from './apiAdmin'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts,deleteProduct } from './apiAdmin'

const ManageProducts = ()=>{
    const {user,token} = isAuthenticated()
    const [products,setProducts] = useState([])

    const loadProducts = ()=>{
        getProducts().then(data=>{
            if(data.error){
                console.log(data.error)
            }
            else{
                setProducts(data)
            }
        })
    }
    const destroyProduct = product =>{
        Swal.fire({
            title: 'Delete Product permenantly?',
            text: "Are you sure want to delete->"+product.name,
            icon: 'warning',
            confirmButtonText: 'Yes,Delete'
          }).then(res => {
            if (res.isConfirmed) {
                deleteProduct(product._id,user._id,token).then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }
                    else{
                        loadProducts()
                        console.log(data)
                    }
                })
            }
          });
    }
    useEffect(()=>{
        loadProducts()
    },[])
    return (
        <Layout title="Manage Products" description="Perform Crud Operations"className='bg-gray-200'>
            <div className='w100 bg-red-200'>
                <div className='w100 text-center py-2 bg-green-500 text-white font-black text-3xl'>{products.length > 0 && (
                    <>Products {products.length}</>
                )}
                </div>
                {products.length > 0 && products.map((p,i)=>{
                    return(
                        <div key={i} className='w100 flex justify-between border-2 border-black my-2 bg-green-400'>
                            <div className='w50 flex justify-center text-xl font-black'>
                                <span>
                                {p.name}
                                </span>  
                            </div>
                            <span className='w20 flex justify-end my-1'>
                                <span className='warning-bg p-1 rounded-xl'>
                                <Link to={`/admin/product/update/${p._id}`}>
                                Update
                                </Link>
                                </span>
                            </span>
                            <span className='w20 flex justify-center my-1'>
                                <button 
                                onClick={()=>{destroyProduct(p)}}
                                className='danger-bg p-1 rounded-xl'>
                                Delete
                                </button>
                            </span>

                        </div>
                    )
                })}
            </div>
        </Layout>    
        )
}

export default ManageProducts