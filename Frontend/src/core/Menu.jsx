import React, { useState,useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signout,isAuthenticated } from '../auth/index';
import Swal from 'sweetalert2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
// context
import { CartContext } from "../context/CartContext"
import { useContext } from "react"


const Menu = () => {
  const {user,token} = isAuthenticated()
  const navigate = useNavigate();
  const location = useLocation();
  const [loading,setLoading] = useState(false)
  const {cartItemsLength} = useContext(CartContext)
  const sidebarRef = useRef(null);
  const menuIconRef = useRef(null);
  const logoRef = useRef(null)

  const showSidebar = () => {
    sidebarRef.current.style.display = 'block';
    sidebarRef.current.style.minWidth = '100%';
    menuIconRef.current.style.display = 'none';
    sidebarRef.current.style.backgroundColor="#363636";
    sidebarRef.current.style.color="#fff";
    logoRef.current.style.display = "none"
  }

  const hideSidebar = () => {
    sidebarRef.current.style.display = 'none';
    menuIconRef.current.style.display = 'block';
    logoRef.current.style.display = "block"
  };
   

  const activeStyles = {
    backgroundColor: '#ff8100c9',
    borderRadius: '20px',
    color:'white',
    
  }
  const isActive = (path) => {
    return location.pathname === path ? activeStyles : { backgroundColor: 'transparent' };
  };

  const userDashboardRoute = ()=>{
    return(
      <li style={isActive('/user/dashboard')} className='nav-links'>
            <Link to='/user/dashboard'>
              <div className='p-1'><DashboardIcon fontSize='large' /></div>
            </Link>
          </li>
    )
  }
  const adminDashboardRoute = ()=>{
    return(
      <li style={isActive('/admin/dashboard')} className='nav-links'>
            <Link to='/admin/dashboard'>
              <div className='p-1'><DashboardIcon fontSize='large' color='error'/></div>
            </Link>
      </li>
    )
  }

  const handleSignOut = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      confirmButtonText: 'Sign Me Out'
    }).then((res) => {
      if (res.isConfirmed){
        setLoading(true)
        signout(() => {
          setLoading(false)
          navigate('/');
        });
      }
    });
  };
 
  const showLoading = ()=>{
    return (
      <div>
        {loading ? 
       
        <div className='absolute flex justify-center font-black min-h-full bg-red-700 min-w-full items-center'>
        <h1 className='text-8xl'>loading... please wait</h1>
        </div>
      : 
     null
        }
      </div>
    );
  }

  return (
    <nav className='flex jusitfy-end items-center text-xl px-6 py-4 bg-blue-500 menu-header w100'>
      {showLoading()}
      <div ref={logoRef} className='w30 '>
        <Link to='/'>
          <span className='text-slate-950 font-black'>GLZ's <span className='font-normal text-orange-400'>Store</span></span>
        </Link> 
      </div>
      <div className='w70 hideOnMobile'>
        <ul className='flex justify-end w100 gap-3.5'>
          <li style={isActive('/')} className='nav-links'>
            <Link to='/'>
              <div className='p-1'><HomeIcon fontSize='large'/></div>
            </Link>
          </li>
          <li style={isActive('/cart')} className=' nav-links cart-container'>
                <Link to='/cart'>
                <ShoppingCartIcon color='success'fontSize='large'/>
                <span className="cart-badge p-1 text-xs">{cartItemsLength}</span>
                </Link>
          </li>
          <li style={isActive('/shop')} className='nav-links'>
            <Link to='/shop'>
              <div className='p-1'><AddShoppingCartIcon fontSize='large'/></div>
            </Link>
          </li>
          {isAuthenticated() && isAuthenticated().user.role === 0 ? (userDashboardRoute()) : null  }
          {isAuthenticated() && isAuthenticated().user.role === 1 ? (adminDashboardRoute()) : null  }
          {!isAuthenticated() && (
            <>
              <li style={isActive('/signin')} className='nav-links'>
                <Link to='/signin'>
                  <div className='p-1'>Login</div>
                </Link>
              </li>
              <li style={isActive('/signup')} className='nav-links'>
                <Link to='/signup'>
                  <div className='p-1'>Sign Up</div>
                </Link>
              </li>
              </>
          )  }
          {isAuthenticated()&&(
            (
              
              <li className='nav-links' style={{ cursor: 'pointer', color: '#ffffff' }}>
                <span onClick={handleSignOut}>
                  <div className='p-1'><LogoutIcon fontSize='large'/></div>
                </span>
              </li>
              
            )
          )}
        </ul>
      </div>
      {/* ------mobile side bar ----- */}
      <div className='showMobile w100  flex justify-end'>
        {/* menu icon */}
        <div className='menu-icon '
              ref={menuIconRef}>
            <span 
                  className='text-slate-950 font-black'
                  onClick={showSidebar}
                  >
              <MenuIcon className='safe' fontSize='large' />
            </span>
        </div>
        
          <div ref={sidebarRef} className='w100 h100 mobile-links fix-pos'>
            {/* close icon */}
                  <div className='w100 bg-green-400 flex justify-center '>
                        <span 
                        className='text-slate-950 font-black'
                        onClick={hideSidebar}
                        >
                            <CloseIcon className='danger' fontSize='large' />
                        </span>
                  </div>
                <ul className='flex flex-col items-center justify-center  h100'>
                  <li className='bg-yellow-400 w100 text-center'>Navigation Links</li>
                  <li style={isActive('/')} className='nav-links'>
                    <Link to='/'>
                      <div className='p-1'><HomeIcon fontSize='large'/></div>
                    </Link>
                  </li>
                  <li style={isActive('/cart')} className='nav-links cart-container'>
                        <Link to='/cart'>
                        <span className="cart-text p-1">
                        <ShoppingCartIcon color='success'fontSize='large'/>
                        </span>
                        <span className="cart-badge p-1 text-xs">{cartItemsLength}</span>
                        </Link>
                      </li>
                  <li style={isActive('/shop')} className='nav-links'>
                    <Link to='/shop'>
                      <div className='p-1'><AddShoppingCartIcon fontSize='large'/></div>
                    </Link>
                  </li>
                  {isAuthenticated() && isAuthenticated().user.role === 0 ? (userDashboardRoute()) : null  }
                  {isAuthenticated() && isAuthenticated().user.role === 1 ? (adminDashboardRoute()) : null  }
                  {!isAuthenticated() && (
                    <>
                      <li style={isActive('/signin')} className='nav-links'>
                        <Link to='/signin'>
                          <div className='p-1'>Login</div>
                        </Link>
                      </li>
                      <li style={isActive('/signup')} className='nav-links'>
                        <Link to='/signup'>
                          <div className='p-1'>Sign Up</div>
                        </Link>
                      </li>
                      </>
                  )  }
                  {isAuthenticated()&&(
                    (
                      
                      <li className='nav-links' style={{ cursor: 'pointer', color: '#ffffff' }}>
                        <span onClick={handleSignOut}>
                          <div className='p-1'><LogoutIcon fontSize='large'/></div>
                        </span>
                      </li>
                      
                    )
                  )}
                </ul>
          </div>
      </div>
      
    </nav>
  );
};

export default Menu;

