import React, { useState } from 'react'

const CheckboxForCategories = ({categories,handleFilters}) => {
    const [checked,setChecked] = useState([])
    const handleToggle = c => ()=>{
        // return the first index found in checked
        //  or
        //   return -1
        const currCatId = checked.indexOf(c)
        const newCheckedCatId = [...checked]
        // if currently checked not in state< push
        // else pull or take off
        if(currCatId === -1){
            newCheckedCatId.push(c)
        }
        else{
            newCheckedCatId.splice(currCatId,1)
        }
        // console.log(newCheckedCatId)
        setChecked(newCheckedCatId)
        handleFilters(newCheckedCatId)
    }
  return categories.length > 0 && categories.map((c,i)=>(
        <li key={i} className='text-xl'>
            <input
            value={checked.indexOf(c._id === -1)}
            onChange={handleToggle(c._id)}
            type='checkbox'
            />
            <label >{c.name}</label>
        </li>
    ))
  
}

export default CheckboxForCategories