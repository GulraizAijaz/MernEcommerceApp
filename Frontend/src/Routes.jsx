import{createBrowserRouter,RouterProvider}from 'react-router-dom'
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home'
import ErrorPage from './Errorroutes';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import Shop from './core/Shop';
import Product from './core/Product'
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile'
import ManageProducts from "./admin/ManageProducts"
import GetAllUsers from './admin/GetAllUsers';
import UpdateSingleUser from './admin/UpdateSingleUser';
import DeleteUser from './admin/DeleteUser';
import CashOnDelivery from './core/CashOnDelivery';

const Routes = ()=> {

    const router = createBrowserRouter([
      {path:"/signin",
      element:<><Signin/></>
      },
      {path:"/",
      element:<><Home/></>,
      errorElement: <ErrorPage />,
      
      },
      {
        path:'/signup',
        element:<><Signup/></>
      },
      {
        path : '/user/dashboard',
        element:<PrivateRoute><UserDashboard/></PrivateRoute>
      },
      {
        path : '/user/cod/:userId',
        element:<PrivateRoute><CashOnDelivery/></PrivateRoute>
      },
      {
        path : '/profile/:userId',
        element:<Profile/>
      },
      {
        path : '/admin/dashboard',
        element:<AdminRoute><AdminDashboard/></AdminRoute>
      },
      {
        path : '/admin/products',
        element:<AdminRoute><ManageProducts/></AdminRoute>
      },
      {
        path : '/create/category',
        element:<AdminRoute><AddCategory/></AdminRoute>
      },
      {
        path : '/create/product',
        element:<AdminRoute><AddProduct/></AdminRoute>
      },
      {
        path : '/admin/product/update/:productId',
        element:<AdminRoute><UpdateProduct/></AdminRoute>
      },
      {
        path : '/admin/users/all',
        element:<AdminRoute><GetAllUsers/></AdminRoute>
      },
      {
        path : '/admin/user/update/:userId',
        element:<AdminRoute><UpdateSingleUser/></AdminRoute>
      },
      {
        path : '/admin/user/delete/:userId',
        element:<AdminRoute><DeleteUser/></AdminRoute>
      },
      {
        path : '/admin/orders',
        element:<AdminRoute><Orders/></AdminRoute>
      },
      {
        path : '/shop',
        element:<Shop/>
      },
      {
        path : '/product/:productId',
        element:<Product/>
      },
      {
        path : '/cart',
        element:<Cart/>
      },

      
    ])
    return (
    <>  
       <RouterProvider router={router}/>
    </>
    );
  }
  
  export default Routes;
  