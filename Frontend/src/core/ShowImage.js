import React from 'react'
import { API } from '../config'
const ShowImage = ({item,url}) => {
  return (
    <div className='w100 flex justify-center product-img '>
        <img 
        className='p-2  '
        alt={item.name}
        src={`${API}/${url}/photo/${item._id}`}/>
    </div>
  )
}

export default ShowImage