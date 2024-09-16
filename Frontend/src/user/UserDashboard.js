import React, {useState,useEffect} from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { getPurchaseHistory } from '../core/apiCore'
import { Link } from 'react-router-dom'
import ShowImage from '../core/ShowImage'
import moment from 'moment'
const Dashboard = () => {
  const {user:{_id,name,email,role},token } = isAuthenticated()
  const [history,setHistory] = useState([])

  const init = (userId,token)=>{
    getPurchaseHistory(userId,token).then(data=>{
      if(data.error){
        console.log(data.error)
      }
      else{
        setHistory(data)
        console.log(data)
      }
    })
  }
  useEffect(()=>{
    init(_id,token)
  },[])
  // userinfromation page
  const userInfo = ()=>{
    return(
      <div className='w100 border-4 border-black '>
      <div className='flex justify-center w-full text-3xl font-extrabold'><span>User Information</span></div>
      <ul className='w-full p-1 '>
        <li className='border border-black w-full text-center text-xl'>Name:{name}</li>
        <li className='border border-black w-full text-center text-xl'>Email:{email}</li>
        <li className='border border-black w-full text-center text-xl'>Role:{role ===1?'Admin':"Buyer"}</li>
      </ul>
    </div>
    )
  }
// user history page 
  const userHistory = ()=>{
    return(
      <div className='w100 border-4 border-black mt10 '>
      <div className='flex justify-center w-full text-3xl font-extrabold'><span>Purchase History</span></div>
      <ul className='w-full p-1 '>
        <li className='border border-black w-full text-center text-xl'>
        <span className='bg-yellow-300 text-black text-2xl font-bold'>
          You have {history.length} orders
        </span>
        {history.length >0 && history.map((h, i) => {
                        return (
                            <div key={i}>
                                {h.products.length > 0 && h.products.map((p, i) => {
                                    return (
                                        <div key={i} 
                                            className='w100 flex-wrap flex justify-center text-black text-2xl font-black bg-green-300 my-4'
                                            >
                                            <div className='w30 historyImage mobile-product-card flex items-center'>
                                            <ShowImage
                                              item={p}
                                              url='product'
                                            />
                                            </div>
                                            <div className='w70 flex justify-center flex-wrap gap-2 my-2'>
                                              <h6 className='w100 bg-red-300 rounded-xl'>Status: {h.status}</h6>
                                              <h6 className='w100 bg-red-200 rounded-xl'>order Type: {h.orderType}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Product name: {p.name}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Transaction Id : {h.transaction_id}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Quantity: {p.count}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Delivery Adress: {h.address}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Product id: {p._id}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl'>Product price: ${p.price}</h6>
                                              <h6 className='w100 bg-yellow-100 rounded-xl my-2'> 
                                                  Purchased date:{" "}
                                                  {moment(h.createdAt).fromNow()}
                                              </h6>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

        </li>
      </ul>
      
      
    </div>
    )
  }

  // user links page 
  const userLinks = ()=>{
    return(
      <div className='w100 border-4 border-black '>
      <div className='flex justify-center w-full text-3xl font-extrabold'><span>user links</span></div>
      <ul className='w-full p-1 '>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/cart'>
              <div className='p-1'>Cart</div>
        </Link>
        </li>
        <li className='border border-black w-full text-center text-xl'>
        <Link to={`/profile/${_id}`}>
              <div className='p-1'>update profile</div>
        </Link>
        </li>
      </ul>
      
      
    </div>
    )
  }
  return (
    <Layout title='DashBoard' description={`hey${name}`} className='w100'>
        <div className='w100 flex justify-evenly flex-wrap bg-orange-300 text-white breaktext mobile-width-parent'>
          <div className='w20 bg-neutral-700 mobile-width-full'>
            {userLinks()}
          </div>
          <div className='w70 bg-neutral-700 mobile-width-full'>
          {userInfo()}
          {userHistory()}
          </div>
        </div>
    </Layout>
  )
}

export default Dashboard