import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';
import { SearchProvider } from './SearchContext';

const GlobalProvider = ({ children }) => {
  return (
    <UserProvider>
      <CartProvider>
        <SearchProvider>
          {children}  
        </SearchProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default GlobalProvider;