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
    <span className='breaktext  safe rounded-md  '>In Stock</span>
    </>
    )
    
}
// UI for unAvailable 
  const showUnavailable = ()=>{    
    return(
        <>
        <span className='breaktext  danger rounded-md  '>out of stock</span>
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
    <div className=' flex-col items-center justify-center'>
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
      className='bg-red-500   product_card_btn'>
      Remove Product
    </button>
    )
  }


  return (
    <div className={`${productwidth}  flex flex-col justify-between items-center product-card rounded-3xl text-center`}>
      <ShowImage
        item={product}
        url='product'
      />
      <div className='product_details '>
        <div className='w100  rounded   product_title'>
          {!details && product.name.length > 15 ? product.name.slice(0, 20) + "..." : product.name}
        </div>
        {
            !showviewproductbutton && 
            (
            <div className='flex flex-wrap '>
            <h2 className='m-1 '>
                Sold :  <span className=''>{product.sold}</span>
            </h2>
            <h2 className='m-1  '>
                shipping:  <span className=''>{product.shipping = false ? 'no':'yes'}</span>
            </h2>
            <h2 className='m-1  '>
                Added on :  <span className=''>{moment(product.createdAt).fromNow()}</span>
            </h2>
            </div>
            )
        }
        <div className='card-body w100  rounded product_desc'>
          <p>
            {!details && product.description.length > 15 ? product.description.slice(0, 25) + "..." : 
            (
            <>
                <span >description: </span>{product.description}
              </>
            )
            }
          </p>
        </div>  
          <div className='w100 flex justify-between flex-wrap product_more_dets'>
            <p className='price'>
              Price: pkr {product.price}
            </p>
            <p className='sold'>
              Sold: {product.sold}
            </p>
            <p className='category'>
                Category :  <span className=''>{(product.category && product.category.name.length > 15) ? product.category.name.slice(0, 13) + "..." : product.category ? product.category.name : "Uncategorized"}</span>
            </p>
            <p className=' status'>
                            <span className=''>{product.quantity > 0 ? (showAvailable()):(showUnavailable())}</span>
            </p>
          </div>
          <div className='flex justify-between w100 flex-wrap'>
            {showviewproductbutton ? (
              <Link to={`/product/${product._id}`}>
                <button className='   product_card_btn'>
                  <span>
                  View Product
                  </span>
                </button>
              </Link>
            ) : (
               
                <button
                    onClick={() => navigate(-1)} // Use navigate(-1) to go back to the previous location
                    className='   product_card_btn'
                    >
                      <span>
                        Go Back
                      </span>
                </button>
            )}

            { showAddToCard && product.quantity > 0 ?
            (<button
            onClick={()=>{addToCart(product)}}
             className='   product_card_btn'>
              <span>
              Add To Cart
              </span>
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