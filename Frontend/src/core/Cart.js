import React from 'react'
import { useState,useEffect,useContext } from 'react'
import Layout from './Layout'
import Card from './Card'
import { getCart,emptyCart } from './cartHelpers'
import Checkout from './Checkout'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'

// context 
import { CartContext } from '../context/CartContext'
const Cart = () => {
    const {user,token} = isAuthenticated()
    const [items,setItems] = useState([])
    const {updateCartItemsLength} = useContext(CartContext)
    useEffect(()=>{
        setItems(getCart())
    },[])

    const updateCartUi = (cart)=>{
        setItems(cart)
    }
    
    const clearCart = ()=>{
        Swal.fire({
            title: 'Delete Cart Items!',
            text: "Action Cannot be Undone",
            icon: 'warning',
            confirmButtonText: 'Yes'
          }).then(res => {
            if (res.isConfirmed) {
                emptyCart(updateCartItemsLength)
                setItems(getCart())
            }
          });
    }
    
    const showItems = (items)=>{
        return(
            <div className='w100 p-1 flex justify-evenly flex-wrap'>
                <div className='flex justify-center w100 bg-lime-500 text-4xl font-black text-white'>
                    <h2>
                        {`Your Cart Has ${items.length} items`}
                    </h2>
                </div>
                <div className='w100 my-2 flex justify-center py-1'>
                    <button 
                        className='bg-red-600 text-white font-black text-2xl w50 rounded-full'
                        onClick={()=>{clearCart()}}>
                        Clear Cart
                    </button>
                </div>
                <div className='w100 my-2 flex justify-center py-1 breaktext'>
                    <Link to={`/user/cod/${user._id}`}
                        className=' text-center bg-green-600 text-white font-black text-2xl w50 rounded-full'>
                        Order With COD
                    </Link>
                </div>
                <div className='w50 flex flex-wrap justify-start cart-product'>
                    {items.map((p,i)=>(
                        <Card
                        productwidth='w100'
                        product={p}
                        key={i}
                        showAddToCard={false}
                        cartUpdate = {true}
                        showRemoveFromCart = {true}
                        updateCartUi={updateCartUi}
                        /> 
                    ))}
                </div>
                <div className='w30 mobile-product-card bg-gray-400'>
                    <Checkout 
                    products={items}
                    updateCartUi={updateCartUi}
                    />
                </div>
                

            </div>
        )
    }
    const showNoItems = ()=>{
        return(
            <div className='w100 flex flex-wrap bg-red-700 text-4xl font-blac text-white'>
                <div className='flex justify-center w100 bg-red-500'>
                    <h2>{`Your Cart Has no items `}
                        <Link to="/shop">Wanna Go to <span className='text-black'>Shop?</span></Link>
                    </h2></div>
            </div>
        )
    }
  return (
    <Layout title='Cart' description={`Look what's in your Cart`}>
        {items.length > 0 ? showItems(items) : showNoItems()}
    </Layout>
  )
}

export default Cart