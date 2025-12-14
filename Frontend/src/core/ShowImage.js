import React from 'react'
import { API } from '../config'
import { Link } from 'react-router-dom'
const ShowImage = ({item,url}) => {
  return (
    <Link to={`/product/${item._id}`} className='w100 flex justify-center product-img '>
        <img 
        alt={item.name}
        src={`${API}/${url}/photo/${item._id}`}/>
    </Link>
  )
}

export default ShowImage