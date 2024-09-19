import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth'
import { getBraintreeClientToken,
        processpayment,
        createOrder } from './apiCore'
import { Link } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import { emptyCart,getCart } from './cartHelpers';
// context
import { useContext } from 'react';
import { CartContext } from "../context/CartContext"

const Checkout = ({products,updateCartUi}) => {
    const {updateCartItemsLength} = useContext(CartContext)
    const [data,setData] = useState({
        success : false,
        clientToken : null,
        error : '',
        instance : {},
        address : "lahore",
        loading : false
    })
    const {user} = isAuthenticated()
    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (id,token)=>{
        getBraintreeClientToken(id,token).then(res=>{
            if (res.error) {
                console.error(res.error);
                setData(prevData => ({ ...prevData, error: res.error,loading:false }));
            } else {
                setData(prevData => ({ ...prevData, clientToken: res.clientToken,loading:false }));
            }
        }) 
    }
    useEffect(() => {
        getToken(userId, token)
    }, [userId, token])

    let deliveryAddress = data.address
    const buy = (e)=>{
        // send nonce to the server
        // nonce = data.instance.requestPaymentMethod()
        setData((prev)=>({...prev,loading:true}))
        let nonce ;
        console.log(data.instance)
        let getNonce = data.instance.requestPaymentMethod()
        .then(data=>{
            // console.log(data)
            setData({...data,error:""})
            nonce = data.nonce
        // once you got nonce (card num,card type) send nonce as paymentMethodNonce
        // and also total to be charged
        // console.log("send nonce and total to price",
        //             nonce,
        //             getTotal(products)
        //         )
        const paymentData = {
            paymentMethodNonce : nonce,
            amount : getTotal(products)
        }
        processpayment(userId,token,paymentData)
        .then(response=>{
            console.log(response)
            setData((prev)=>({...prev,success:response.result.success}))
            // createOrder
            const createOrderData = {
                products:products,
                transaction_id: response.result.transaction.id,
                amount:response.result.transaction.amount,
                address: deliveryAddress,
                orderType:"Pre Paid"
            }
            console.log("line 72 checkout createOrderDataaa--->>",createOrderData)
            createOrder(userId,token,createOrderData).then(data=>{
                if(data.error){
                    console.log(data.error)
                    setData(prevData => ({ ...prevData, error: data.error,loading:false }));
                }
                else{
                    // empty cart
                    emptyCart(()=>{
                        setData((prev)=>({...prev,loading:false}))
                    })
                    // update UI of cart
                    updateCartUi(getCart())
                    updateCartItemsLength()
                }
            })
            
        })
        .catch(error=>
            {console.log(error)
                setData((prev)=>({...prev,loading:false}))
            })
        })
        .catch(err=>{
            console.log('this is dropin error  :',err)
            setData({...data,error:err.message})
        })
        
    }

    const handleAddress = e =>{
        setData({...data,address:e.target.value})
    }
    const getTotal = () => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((currentValue, nextValue) => {
            return currentValue + (nextValue.count || 0) * (nextValue.price || 0);
        }, 0);
    }
    const showLoading = (loading)=>(
        <div>
            {
                loading?(
                    <div className='w100 bg-red-500 text-white font-black text-4xl text-center h100'>
                        .......................Loading.............................
                    </div>
                ):null
            }
        </div>
    )
    const showError = (err)=>{
        return(
            <div className='bg-red-500 text-white font-black w100 text-center'>
                {data.error ? (err):null}
                
            </div>
        )
    }
    const showSuccess = ()=>{
        return(
            <div className='bg-green-500 text-white font-black w100 text-center'>
                {data.success === true ? (<span>Transaction Successful</span>) : null}
                
            </div>
        )
    }
    const showDropIn = ()=>{
        return(
        <div onBlur={()=>{
            setData((prev)=>({prev,error:""}))
        }}>
            {
                data.clientToken !== null && products.length > 0 ? (
                    <div className='w100 bg-pink-600'>
                        <div className='w100'>
                        <DropIn
                            options={{ authorization: data.clientToken
                             }}
                            onInstance={(instance) => (data.instance = instance)
                            }
                        />
                        </div>
                        <div className='w100 flex justify-center'>
                            <button 
                            onClick={(e)=>{buy(e)}}
                            className='bg-green-500 text-white font-black rounded-xl px-2 py-1 my-1'>
                                Pay Now
                            </button>
                        </div>
                    </div>
                ):null
            }
        </div>
        )
    }
    const showCheckOut = ()=>{
        return(
            <div className=''>
            {isAuthenticated() && user.role !== 1?(
                <div className='w100 flex-wrap justify-center'>
                    <div className='w100 flex justify-center bg-blue-300 flex-wrap mt10'>
                            <h1 className='w100'>Enter Address</h1>
                            <input 
                            type='text'
                            value={data.address}
                            onChange={handleAddress}
                            className=' font-black rounded-xl px-2 py-1 my- w100'/>
                    </div>
                    <div className='w100 flex justify-center bg-blue-300 flex-wrap'>
                    {showDropIn()}
                    </div>
                    
                </div>
            ):(
                <Link to='/signin'>
                    
                    <div className=' text-white font-bold rounded-xl w100 bg-blue-500 text-black p-2 my-4'>
                    <button >Sign In with customer account</button>
                    </div>
                </Link>
            )}
            </div>
        )
    }
    
    return(
        <div className='w100  flex flex-wrap text-2xl justify-center'>
            <div className='w100 flex justify-center'>
                <h2>Your Total Amount For this Cart is:
                    <span className='bg-red-500 text-white p-1 m-1 rounded-md font-black'>
                        {getTotal()}
                    </span>
                     pkr Only
                </h2>
            </div>
            {showLoading(data.loading)}
            {showError(data.error)}
            {showSuccess()}
            {showCheckOut()}
        </div>
    )
}

export default Checkout