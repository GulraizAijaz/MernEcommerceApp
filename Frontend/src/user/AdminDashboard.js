import React from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
const AdminDashboard = () => {
  const {user:{_id,name,email,role} } = isAuthenticated()

  // userinfromation page
  const AdminInfo = ()=>{
    return(
      <div className='w-full border-4 border-black '>
      <div className='flex justify-center w-full text-3xl font-extrabold'><span>User Information</span></div>
      <ul className='w-full p-1 '>
        <li className='border border-black w-full text-center text-xl'>Name:{name}</li>
        <li className='border border-black w-full text-center text-xl'>Email:{email}</li>
        <li className='border border-black w-full text-center text-xl'>Role:{role ===1?'Admin':"Buyer"}</li>
      </ul>
    </div>
    )
  }

  // user links page 
  const AdminLinks = ()=>{
    return(
      <div className='w-full border-4 border-black '>
      <div className='flex justify-center w-full text-3xl font-extrabold'><span>Admin links</span></div>
      <ul className='w-full p-1 '>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/create/category'>
              <div className='p-1'>Create Category</div>
        </Link>
        </li>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/create/product'>
              <div className='p-1'>Create Product</div>
        </Link>
        </li>
        {/* <li className='border border-black w-full text-center text-xl'>
        <Link to='/profile/update'>
              <div className='p-1'>update profile</div>
        </Link>
        </li> */}
        <li className='border border-black w-full text-center text-xl'>
        <Link to={`/profile/${_id}`}>
              <div className='p-1'>Update profile</div>
        </Link>
        </li>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/admin/orders'>
              <div className='p-1'>View Orders</div>
        </Link>
        </li>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/admin/products'>
              <div className='p-1'>Manage Products</div>
        </Link>
        </li>
        <li className='border border-black w-full text-center text-xl'>
        <Link to='/admin/users/all'>
              <div className='p-1'>Manage Users</div>
        </Link>
        </li>
      </ul>
      
      
    </div>
    )
  }
  return (
    <Layout title='DashBoard' description={`Good Day : ${name}`} className='w100'>
        <div className='w100 flex justify-evenly bg-rose-300 text-white'>
          <div className='w20 bg-neutral-700'>
            {AdminLinks()}
          </div>
          <div className='w70 bg-neutral-700'>
          {AdminInfo()}
          </div>
        </div>
    </Layout>
  )
}

export default AdminDashboard