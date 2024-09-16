import React, {useState} from "react";

const CheckboxPrices = ({prices,handleFilters}) => {
    const [value,setValue] = useState(0)
    const handlechange = e =>{
        handleFilters(e.target.value)
        setValue(e.target.value)

    }
    return prices.map((p,i)=>(
        <div key={i} className='text-xl'>
            <input
            value={`${p._id}`}
            name={p}
            onChange={handlechange}
            type='radio'
            />
            <label >{p.name}</label>
        </div>))
}

export default CheckboxPrices