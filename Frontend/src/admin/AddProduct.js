import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { createProduct,getCategories } from './apiAdmin'
import Swal from 'sweetalert2'
// import { redirect, useNavigate } from 'react-router-dom'

const AddProduct = ()=>{
    // use state 
    const [values , setValues] = useState({
        name : "",
        description:"",
        price: "",
        categories: [],
        photo:"",
        categoryId: "",
        shipping: true,
        quantity: "",
        photo: "",
        loading: false,
        error:'',
        createdProduct: "",
        redirectToProfile: false,
        formData:""
    })
    const {name,
           description,
           price,
           photo,
           categories,
           categoryId,
           shipping,
           quantity,
           loading,
           error,
           createdProduct,
           redirectToProfile,
           formData
        } = values

        // use effect load categories and set form data
        const init = ()=>{
            getCategories().then(res=>{
                if(res.error){
                    setValues({...values,error:res.error})
                }
                else{
                    setValues({...values,categories:res,formData: new FormData()})
                    // console.log("state",values.categories)
                }
            })
        }
        useEffect(()=>{
                init()
        },[])

        useEffect(() => {
            if (createdProduct) {
                Swal.fire({
                    title: 'Product Created!',
                    text: name,
                    icon: 'success',
                    confirmButtonText: 'Create more?'
                }).then(res => {
                    if (res.isConfirmed) {
                        setValues({ ...values, error: '', createdProduct: "" });
                    }
                });
            }
        }, [createdProduct]);

        useEffect(() => {
            if (error) {
                Swal.fire({
                    title: 'error creating product!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Try again?'
                }).then(res => {
                    if (res.isConfirmed) {
                        setValues({ ...values, error: '', createdProduct: "" });
                    }
                });
            }
        }, [error]);
    // get user from local storage
    const {user,token} = isAuthenticated()
    // handle submit
    const handlechange = name => event=> {
        const value =
        name === "photo"? event.target.files[0] : event.target.value;
        formData.set(name , value);
        // console.log(formData)
        setValues({...values, [name]:value})
    }

    // handle change 
    const handleSubmit = (e)=>{
        e.preventDefault()
        setValues({...values,error:'',loading:true})
        createProduct(user._id,token,formData).then(res=>{
            if(res.error){
                console.log(res.error)
                setValues({...values,error:res.error,loading:false})
            }
            else if (res.success){
                console.log(res.success)
                setValues({...values,error:'',loading:false,createdProduct:true})

            }
            else{
                console.log("something went wrong")
            }
        })
        
         
            
        
    }
    const newProductForm = ()=>{
        return(
        <form className="flex flex-col justify-center items-center w-full bg-gray-400 p-4" onSubmit={handleSubmit}>
            <h2 className="p-2 bg-blue-400 border border-black w-full text-center text-3xl font-black">
                Add new Product
            </h2>
                <div className="w-full flex flex-col items-center mt-4">
                        <p className="text-2xl mb-2">Post Product Photo</p>
                        <input
                        onChange={handlechange("photo")}
                        name="photo"
                        required
                        accept="image/*"
                        className="w-3/4"
                        type="file"
                        />
                </div>
                <div className="w-full flex justify-center mt-4">
                        <label className="w-3/4">
                        Name:
                        <input
                            onChange={handlechange("name")}
                            value={name}
                            required
                            className="w-full mt-2 p-1 border border-gray-400"
                            type="text"
                        />
                        </label>
                </div>
                <div className="w-full flex justify-center mt-4">
                        <label className="w-3/4">
                        Desciption:
                        <input
                            onChange={handlechange("description")}
                            value={description}
                            required
                            className="w-full mt-2 p-1 border border-gray-400"
                            type="text"
                        />
                        </label>
                </div>
                <div className="w-full flex justify-center mt-4">
                        <label className="w-3/4">
                        Price:
                        <input
                            onChange={handlechange("price")}
                            value={price}
                            required
                            className="w-full mt-2 p-1 border border-gray-400"
                            type="number"
                        />
                        </label>
                </div>
                <div className="w-full flex justify-center mt-4 text-3xl">
                    categories
                </div>
                <div className="w-full flex justify-center mt-4 text-2xl">
                    Not any category related to you product?
                    <Link className='text-blue-800 underline' to='/create/category'>
                    create your desired one <span>Click Here</span>
                    </Link>
                </div>
                <div className="w-full flex justify-center mt-4">
                        <select
                        onChange={handlechange("categoryId")}
                        className="w-3/4">
                        <option>Select A category</option>
                        {
                            categories.length > 0  && categories.map((c,i)=>(
                                <option key={i} value={c._id}>{c.name}</option>
                            ))
                        }
                        </select>
                </div>
                <div className="w-full flex justify-center mt-4">
                    <label className="w-3/4">
                        Shipping?:
                        <select
                        onChange={handlechange("shipping")}
                        value={shipping}
                        
                        className="w-full mt-2 p-1 border border-gray-400"
                        >
                        <option value="">Select an option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        </select>
                    </label>
                </div>
                <div className="w-full flex justify-center mt-4">
                        <label className="w-3/4">
                        Quantity:
                        <input
                            onChange={handlechange("quantity")}
                            value={quantity}
                            required
                            className="w-full mt-2 p-1 border border-gray-400"
                            type="number"
                        />
                        </label>
                </div>
                
                <div className="w-full flex justify-center mt-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Submit
                        </button>
                </div>
        </form>
           
        )
    }
    const showLoading = ()=>{
        return (
          <div>
            {loading ? <div className='flex absolute justify-center font-black min-h-full bg-yellow-700 min-w-full items-center '>
           <h1 className='text-8xl'>loading... please wait</h1>
          </div>
          : 
         null
            }
          </div>
        );
      }
      
    
    return(
        <Layout  title="Create new Product " description={`Hey ${user.name}, Upload new Product today (-,-)`}
    className=''>
        {showLoading()}
      {newProductForm()}
       
    </Layout>
    )
}

export default AddProduct