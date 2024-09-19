import React, { useState,useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addItem,updateItem,removeItem,getCart } from './cartHelpers';
import ShowImage from './ShowImage';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// context
import { useContext } from 'react';
import { CartContext } from "../context/CartContext"
import { isAuthenticated } from '../auth';
const Card = ({ product,
                productwidth = "w30",
                details = false,
                showviewproductbutton = true,
                showAddToCard = true,
                cartUpdate = false,
                showRemoveFromCart=false,
                updateCartUi,
                 }) => {
  const navigate = useNavigate();
  const [redirect,setRedirect] = useState(false)
  const [count,setCount] = useState(product.count)
  const {updateCartItemsLength} = useContext(CartContext)
  const {user} = isAuthenticated()
  console.log(user)

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
      navigate('/cart');
    }
  }, [redirect, navigate]);

  // UI for available 

  const showAvailable = ()=>{
    return(
    <>
    <span className='breaktext text-white safe rounded-md  '>In Stock</span>
    </>
    )
    
}
// UI for unAvailable 
  const showUnavailable = ()=>{    
    return(
        <>
        <span className='breaktext text-white danger rounded-md  '>out of stock</span>
        </>
        )
}
// add item to cart f(x)
  const addToCart = ()=>{
    if(user && user.role === 1){
      Swal.fire({
        title: 'Cannot add to Cart',
        text: "You Are Seller",
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
    
    else{
      addItem(product,()=>{
        Swal.fire({
          title: 'Product Added Successfuly!',
          text: "Want to see Cart?If not press ESC key or tap outside this popup",
          icon: 'success',
          confirmButtonText: 'Yes'
        }).then(res => {
          if (res.isConfirmed) {
            setRedirect(true)
          }
        });
        updateCartItemsLength()
    })
    }
    
}
  

// handling update function for item quantity
  const handleChange = productId => e => {
    const newCount = e.target.value < 1 ? 1 : e.target.value ;
    setCount(newCount)
    if(newCount >=1 ){
      updateItem(productId, newCount)
      updateCartUi(getCart())
    }
  }

  // handling delete for items 
  const handleDelete = (productId)=>{
    removeItem(productId,()=>{
      updateCartItemsLength()
    })
    updateCartUi(getCart())
  }


  const showCartUpdateOptions =(cartUpdate)=>{
    return cartUpdate && 
    (
    <div className='bg-pink-500 flex-col items-center justify-center'>
      <span>Adjust Quantity</span>
      {/* <span>{count}</span> */}
      <input
      className='text-center bg-white text-xl w100' 
      type='number'
      value={count}
      min={1}
      onChange={handleChange(product._id)}/>
    </div>
    )
  }

  const showRemoveButton = (showRemoveFromCart)=>{
    return showRemoveFromCart && 
    (
      <button
      onClick={()=>{handleDelete(product._id)}}
      className='bg-red-500 p-2 rounded-full text-white'>
      Remove Product
    </button>
    )
  }


  return (
    <div className={`${productwidth} bg-gray-400 p-2 my-2 product-card rounded-3xl text-center `}>
      <ShowImage
        item={product}
        url='product'
      />
      <div className=''>
        <div className='w100 text-3xl bg-blue-500 p-1 rounded border-2 border-black text-white'>
          {!details && product.name.length > 15 ? product.name.slice(0, 20) + "..." : product.name}
        </div>
        {
            !showviewproductbutton && 
            (
            <div className='flex flex-wrap text-black'>
            <h2 className='bg-blue-500 font-black border-2 border-black m-1 text-black'>
                Sold :  <span className='text-white'>{product.sold}</span>
            </h2>
            <h2 className='bg-blue-500 font-black border-2 border-black m-1 text-black '>
                shipping:  <span className='text-white'>{product.shipping = false ? 'no':'yes'}</span>
            </h2>
            <h2 className='bg-blue-500 font-black border-2 border-black m-1 text-black '>
                Added on :  <span className='text-white'>{moment(product.createdAt).fromNow()}</span>
            </h2>
            </div>
            )
        }
        <div className='card-body w100 border-2 border-black bg-blue-500 p-1 rounded text-white'>
          <p className='text-xl'>
            {!details && product.description.length > 15 ? product.description.slice(0, 25) + "..." : 
            (
            <>
                <span className='text-black text-2xl font-black'>description: </span>{product.description}
              </>
            )
            }
          </p>
        </div>  
          <div className='w100 flex justify-between '>
            <p className='bg-blue-500 text-red-900 font-black border-2 border-black m-1 text-white '>
              Price: pkr {product.price}
            </p>
            <p className='text-red-900 bg-blue-500 font-black border-2 border-black m-1 text-white'>
              Sold: {product.sold}
            </p>
            <p className='bg-blue-500 font-black border-2 border-black m-1 '>
                Category :  <span className='text-white'>{product.category ? product.category.name : "Uncategorized"}</span>
            </p>
            <p className='bg-blue-500 font-black border-2 border-black m-1 text-black '>
                            <span className='text-white'>{product.quantity > 0 ? (showAvailable()):(showUnavailable())}</span>
            </p>
          </div>
          <div className='flex justify-between w100'>
            {showviewproductbutton ? (
              <Link to={`/product/${product._id}`}>
                <button className='bg-pink-500 p-2 rounded-full text-white'>
                  View Product
                </button>
              </Link>
            ) : (
               
                <button
                    onClick={() => navigate(-1)} // Use navigate(-1) to go back to the previous location
                    className='bg-pink-500 p-2 rounded-full text-white'
                    >
                        Go Back
                </button>
            )}

            { showAddToCard && product.quantity > 0 ?
            (<button
            onClick={()=>{addToCart(product)}}
             className='bg-pink-500 p-2 rounded-full text-white'>
              Add To Cart
            </button>) 
            :
            (
                showCartUpdateOptions(cartUpdate)
            )
            }
            {
              showRemoveButton(showRemoveFromCart)
            }
          </div>
        </div>
      </div>
    
  );
};

export default Card;