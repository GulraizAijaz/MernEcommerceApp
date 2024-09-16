import React, { createContext,useState,useEffect} from 'react';
import { itemTotal } from '../core/cartHelpers';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItemsLength, setCartItemsLength] = useState(0);
      useEffect(() => {
        // Set the initial cart items length when the component mounts
        const initialCartLength = itemTotal();
        setCartItemsLength(initialCartLength);
    }, []);
    const updateCartItemsLength = () => {
    const updatedCartLength = itemTotal();
    setCartItemsLength(updatedCartLength);
};

  return (
    <CartContext.Provider value={{ cartItemsLength,updateCartItemsLength }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };