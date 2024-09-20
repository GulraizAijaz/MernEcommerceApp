import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import moment from 'moment'
import { isAuthenticated } from '../auth'
import { listOrders ,getStatusValues,updateOrderStatus} from './apiAdmin'



const Orders = () => {

    const [orders,setOrders] = useState([])
    const [error,setError] = useState([])
    const [statusValues,setStatusValues] = useState([])

    const {user,token} = isAuthenticated()

    const loadOrders = ()=>{
        listOrders(user._id,token).then(res=>{
            if(res.error){
                console.log(res.error)
            }
            else{
                setOrders(res)
            }
        })
    }
    const loadStatusValues = ()=>{
        getStatusValues(user._id,token).then(res=>{
            if(res.error){
                console.log(res.error)
            }
            else{
                setStatusValues(res)
            }
        })
    }
    const handleStatusChange = (e,orderId)=>{
        updateOrderStatus(user._id,token,orderId,e.target.value).then(data=>{
            if(data.error){
                console.log("status updating failed")
            }
            else{
                loadOrders()
            }
        })
    }
    useEffect(()=>{
        loadOrders()
        loadStatusValues()
    },[])

    const showStatus =  o=>{
        return(
            <div>
                <h1 className='w100 text-center bg-yellow-200 text-black'>{o.status}</h1>
                <select className='w100 text-center bg-red-300 text-black'
                        onChange={(e)=>{handleStatusChange(e,o._id)}}
                >
                <option>update status?</option>
                {
                    statusValues.length > 0 && statusValues.map((status,index)=>(
                        <option key={index}>
                            {status}
                        </option>
                    ))
                }
                </select>
            </div>
        )
    }

    const noOrder = order =>{
        return order.length < 1 ? ( 
            <div className='w100 bg-red-500 text-white font-black text-4xl p-2  flex justify-center items-center'>
            <h1>you have no Orders</h1>
            </div>
        ):null
    }
    const showOrdersLength = (orders)=>{
        return orders.length > 0 ? ( 
            <div className='w100 bg-green-500 text-white font-black text-4xl p-2  flex justify-center items-center'>
            <h1>you have {orders.length} Orders</h1>
            </div>
        ):null
    }
  return (
    <Layout title='Order' description={`Look what you got ordered today`}>  
        {
            noOrder(orders)
        }
        {
            showOrdersLength(orders)
        }
        {
        <div className='w100 flex justify-center bg-gray-700 '>
            <div className='w70 text-center'>
            {
            orders.length > 0 && orders.map((o,i)=>{
                return(
                    <div key={i} className={`flex-col m-2 bg-gray-400 text-white breaktext`}>
                        <h1 className='w100 border-2 border-red text-2xl font-black text-black bg-blue-400'>{o._id}</h1>
                        <h1 className='w100 border-2 border-red text-2xl font-black text-black bg-blue-400'>{o.orderType}</h1>
                        <div className='w100 border-2 border-black text-2xl font-black '>{showStatus(o)}</div>
                        <p className='w100 border-2 border-black text-2xl font-black '>Transaction Id : {o.transactionId || o.transaction_id}</p>
                        <p className='w100 border-2 border-black text-2xl font-black '>Amount : {o.amount}</p>
                        <p className='w100 border-2 border-black text-2xl font-black '>Ordered By : {o.user? o.user.name : "user not available"}</p>
                        <p className='w100 border-2 border-black text-2xl font-black '>Ordered On : {moment(o.createdAt).fromNow()}</p>
                        <p className='w100 border-2 border-black text-2xl font-black '>Delivery Address : {o.address}</p>
                    </div>
                )
            }) 
        } 
        </div>
        </div>
        }
        {console.log(orders)}
        
    </Layout>
  )
}

export default Orders