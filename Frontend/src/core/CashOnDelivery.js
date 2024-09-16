import { isAuthenticated } from '../auth'
import { useState,useEffect } from 'react'
import Layout from "./Layout"
import { createCodOrder } from './apiCore'
import { emptyCart, getCart,itemTotal } from './cartHelpers'
import { useParams } from 'react-router-dom'
import Card from './Card'
// context cart
import { useContext } from 'react';
import { CartContext } from "../context/CartContext"
import Swal from 'sweetalert2'

const CashOnDelivery = () => {
    const {updateCartItemsLength} = useContext(CartContext)
    const [products,setProducts] = useState([])
    const [userData,setUserData] = useState({
        name : "",
        email : "",
        address : "",
        phone :  ""
    })
    const {name,address,phone,email} = userData
    const {user,token} = isAuthenticated()
    const {userId} = useParams()
   
    // use effect 
    useEffect(()=>{
        setUserData({
            ...userData,
            name: user.name,
            address:user.address || "home maybe",
            email:user.email,
            phone:user.phone || 9211111111111111
        })
        
    },[])
    useEffect(()=>{
        setProducts(getCart())
    },[])
    const placeOrder = (e)=>{
        e.preventDefault()
        if(!products || products.length<1){
            Swal.fire({
                title: 'Error!',
                text: "please add something in cart",
                icon: 'error',
                confirmButtonText: 'continue'
              })
        }
        else{
            const createOrderData = {
                products:products,
                transaction_id: "frontend_types_Static",
                name:userData.name,
                email:userData.email,
                address: userData.address,
                phone:userData.phone || "not defined by user",
            }
            createCodOrder(userId,token,createOrderData).then(res=>{
                if(res.error){
                    Swal.fire({
                        title: 'Error!',
                        text: res.error,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                      console.log(res.error)
                }
                else {
                    emptyCart(()=>{
                        Swal.fire({
                            title: 'Created!',
                            text: "Order created successfully",
                            icon: 'success',
                            confirmButtonText: 'Okay'
                          })
                    })
                    updateCartItemsLength()
                    setProducts(getCart())
                    console.log(res)
                }
            })
        }
        
    }
    const updateCartUi = (cart)=>{
        setProducts(cart)
    }
    const handleChange = name => event =>{
        setUserData({...userData,[name]:event.target.value})
      }
      const getTotal = () => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((currentValue, nextValue) => {
            return currentValue + (nextValue.count || 0) * (nextValue.price || 0);
        }, 0);
    }

  
  const showForm = (name,address,phone,email)=>{
    return(
        <>
         {/* form for getting data of user for delivery */}
         <form className='w100 bg-gray-600 flex justify-center flex-wrap py-2'>
            <h1 className='w100 bg-green-500 py-2 my-1 text-center text-xl'>Your items in cart are {itemTotal()} items</h1>
            <h1 className='w100 bg-yellow-500 py-2 my-1 text-center text-xl'>Your Total amount to pay is:{getTotal()}PKR</h1>
            
            <h1 className='w100 text-center text-xl'>Your Email is:</h1>
            <div><span className='bg-black text-white rounded-xl p-1 font-black text-2xl'>{email}</span></div>
            <h1 className='w100 text-center text-xl'>Enter Recipient Name</h1>
            <input 
            className='text-center rounded-xl' 
            type='text'
            value={name}
            onChange={handleChange('name')}/>        
            <h1 className='w100 text-center text-xl'>Enter Delivery Address</h1>
            <input 
            className='text-center rounded-xl' 
            type='text'
            value={address}
            onChange={handleChange('address')}
            />        
            <h1 className='w100 text-center text-xl'>Enter Your active Phone No</h1>
            <input className='text-center rounded-xl'
             type='number'
             value={phone}
             onChange={handleChange('phone')}
             />  
            <div className='w100 flex justify-center py-1 '>
                <button
                className='bg-green-600 p-1 rounded-xl'
                onClick={(e)=>{placeOrder(e)}}
                >
                    Place Order
                </button>
            </div>    
            </form>
        </>
    )
  }
  const showProducts = ()=>{
        return(
            <div className='w100 flex justify-evenly flex-wrap'>
            {products.length>0 && products.map((p,i)=>(
                <Card
                product={p}
                key={i}
                showAddToCard={false}
                cartUpdate = {true}
                showRemoveFromCart = {true}
                updateCartUi={updateCartUi}
                /> 
            ))}
            </div>
        )
  }
  return (
    <>
    <Layout title="Cash On Delivery" description="Order Now With Cash On Delivery"className='bg-gray-200'>
        {products && products.length > 0 ? showForm(name,address,phone,email) : null}
        {showProducts()}
      </Layout>
    </>
  )
}

export default CashOnDelivery



