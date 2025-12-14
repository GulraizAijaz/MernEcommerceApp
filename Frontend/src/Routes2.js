import{createBrowserRouter,RouterProvider}from 'react-router-dom'
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home'
import ErrorPage from './Errorroutes';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './auth/PrivateRoute';
import UnAuthRoutes from './auth/UnAuthRoutes';
import AdminRoute from './auth/AdminRoute';
import AddCategory from './admin/AddCategory'
import GetAllCategories from './admin/GetAllCategories';
import UpdateCategory from './admin/UpdateCategory';
import DeleteCategory from './admin/DeleteCategory';
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import Shop from './core/Shop';
import Product from './core/Product'
import ChatPage from './core/Chat'
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile'
import ManageProducts from "./admin/ManageProducts"
import GetAllUsers from './admin/GetAllUsers';
import UpdateSingleUser from './admin/UpdateSingleUser';
import DeleteUser from './admin/DeleteUser';
import CashOnDelivery from './core/CashOnDelivery';
import Search from './core/SearchPage';
import AppLayout from './AppLayout';

    const router = createBrowserRouter([
    {
    path: "",
    element: <AppLayout />, 
        children: [
            // all childs 
            {path:"/signin",
            element:<UnAuthRoutes><Signin/></UnAuthRoutes>
            },
            {path:"/",
            element:<><Home/></>,
            errorElement: <ErrorPage />,
            },
            {
                path:'/signup',
                element:<UnAuthRoutes><Signup/></UnAuthRoutes>,
                errorElement: <ErrorPage />,  
            },
            {
                path : '/user/dashboard',
                element:<PrivateRoute><UserDashboard/></PrivateRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/user/cod/:userId?',
                element:<PrivateRoute><CashOnDelivery/></PrivateRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/profile/:userId',
                element:<Profile/>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/dashboard',
                element:<AdminRoute><AdminDashboard/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/products',
                element:<AdminRoute><ManageProducts/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/create/category',
                element:<AdminRoute><AddCategory/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : 'admin/category/manage',
                element:<AdminRoute><GetAllCategories/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : 'admin/category/update/:categoryId',
                element:<AdminRoute><UpdateCategory/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : 'admin/category/delete/:categoryId',
                element:<AdminRoute><DeleteCategory/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/create/product',
                element:<AdminRoute><AddProduct/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/product/update/:productId',
                element:<AdminRoute><UpdateProduct/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/users/all',
                element:<AdminRoute><GetAllUsers/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/user/update/:userId',
                element:<AdminRoute><UpdateSingleUser/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/user/delete/:userId',
                element:<AdminRoute><DeleteUser/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/admin/orders',
                element:<AdminRoute><Orders/></AdminRoute>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/shop',
                element:<Shop/>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/product/:productId',
                element:<Product/>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/cart',
                element:<Cart/>,
                errorElement: <ErrorPage />,
            },
            {
                path : '/cart',
                element:<Cart/>,
                errorElement: <ErrorPage />,
            },
            {
                // path : '/search/:query?/:categoryId?/:categoryName?',
                path : '/search/:query?/:categoryId?/:categoryName?',
                element:<Search/>,
                errorElement: <ErrorPage />,
            },
            {
                // path : '/search/:query?/:categoryId?/:categoryName?',
                path : '/chat-with-us',
                element:<ChatPage/>,
                errorElement: <ErrorPage />,
            },
            // all childs ends
        ],
    },
    ])
  
  
  export default router;
  