import React, { useState,useRef, useEffect } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
// context
import { CartContext } from "../context/CartContext"
import { useContext } from "react"
import SearchDropdown from '../components/search_dropdown'
import { menuData } from './menus';

const Menu = () => {
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // const {user,token} = isAuthenticated()
  const navigate = useNavigate();
  const location = useLocation();
  const [loading,setLoading] = useState(false)
  const {cartItemsLength} = useContext(CartContext)

  const sidebarRef = useRef(null);
  const menuIconRef = useRef(null);
  const logoRef = useRef(null)


  const showSidebar = () => {
    sidebarRef.current.classList.add('show')
    menuIconRef.current.style.display = "none"
    document.body.classList.add('no-scroll')
  }
   
  const hideSidebar = () => {
    sidebarRef.current.classList.remove('show')      
    menuIconRef.current.style.display = ""
    document.body.classList.remove('no-scroll')
  };



  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  const userDashboardRoute = ()=>{
    return(
      <li className={`nav-links `}>
            <Link className={`hover_links relative  ${isActive('/user/dashboard')}`} to='/user/dashboard'>
              <div className='p-1'><DashboardIcon fontSize='large' /></div>
            </Link>
          </li>
    )
  }
  const adminDashboardRoute = ()=>{
    return(
      <li className={`nav-links  `}>
            <Link className={`hover_links relative ${isActive('/admin/dashboard')}`} to='/admin/dashboard'>
              <div className='p-1'><DashboardIcon fontSize='large' /></div>
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
      <>
        {
          loading ?
        <div className='absolute flex justify-center items-center custom_loading w-full'>
          <span className='loader'></span>
        </div>
        :
        ""
        }
      </>
    );
  }

  return (
    <header className={`flex jusitfy-end items-center  menu-header w-full relative ${isSticky ? 'sticky_header' : ''}`}>
      <div className='header_inner  flex jusitfy-end items-center text-xl px-6 py-4  w-full'>
      {showLoading()}

      {/* logo */}
      <div ref={logoRef} className='w30 logo_wrap'>
        <Link className={`hover_links relative`} to='/'>
          <span className='text-slate-950 font-black'>GLZ's <span className='font-normal text-orange-400'>Store</span></span>
        </Link> 
      </div>
      
      <div className='w70 hideOnMobile '>
        <ul className='flex justify-end w100 gap-3.5 items-center navs_desktop'>
          <li className={`nav-links  `}>
            <Link className={`hover_links relative ${isActive('/')}`} to='/'>
              <div className='p-1'><HomeIcon fontSize='large'/></div>
            </Link>
          </li>
          <li className={`nav-links SearchIcon `}>
            
              <div className='p-1'><SearchIcon fontSize='large'/></div>
            
            <SearchDropdown />
          </li>
          <li className={`nav-links cart-container  `}>
                <Link className={`hover_links relative ${isActive('/cart')}`} to='/cart'>
                <div className='p-1'>
                <ShoppingCartIcon fontSize='large' style={{color:'#000000'}}/>
                </div>
                <span className="cart-badge p-1 text-xs">{cartItemsLength}</span>
                </Link>
          </li>
          <li className={`nav-links  `}>
            <Link className={`hover_links relative ${isActive('/shop')}`} to='/shop'>
              <div className='p-1'><AddShoppingCartIcon fontSize='large'/></div>
            </Link>
          </li>
          <li className={`nav-links  `}>
            <Link className={`hover_links relative ${isActive('/chat-with-us')}`} to='/chat-with-us'>
              <div className='p-1'>Chat test</div>
            </Link>
          </li>
          {isAuthenticated() && isAuthenticated().user.role === 0 ? (userDashboardRoute()) : null  }
          {isAuthenticated() && isAuthenticated().user.role === 1 ? (adminDashboardRoute()) : null  }
          {!isAuthenticated() && (
            <>
              <li className={`nav-links  link_sign_in_up`}>
                <Link className={`hover_links relative sign_btn ${isActive('/signin')}`} to='/signin'>
                  <div >Login</div>
                </Link>
              </li>
              <li className={`nav-links  link_sign_in_up`}>
                <Link className={`hover_links relative sign_btn ${isActive('/signup')}`} to='/signup'>
                  <div>Sign Up</div>
                </Link>
              </li>
              </>
          )  }
          {isAuthenticated()&&(
            (
              
              <li className='nav-links ' style={{ cursor: 'pointer', color: '#ffffff' }}>
                <span onClick={handleSignOut}>
                  <div className='p-1'><LogoutIcon fontSize='large' style={{color:'#000000'}}/></div>
                </span>
              </li>
              
            )
          )}
          
        </ul>
      </div>
      {/* ------mobile side bar ----- */}


      <div className='mobile_sidebar'>
        {/* menu icon */}
        <div className='menu-icon '
              ref={menuIconRef}>
            <span 
                  className='text-slate-950 font-black'
                  onClick={showSidebar}
                  >
              <MenuIcon  fontSize='large' />
            </span>
            <div className={`nav-links SearchIcon `}>
            
              <div className='p-1 '><SearchIcon fontSize='large'/></div>
            
            <SearchDropdown />
          </div>
        </div>
        
          <div ref={sidebarRef} className='w100 h100 mobile-links '>
            {/* close icon */}
                  <div className='w100  flex justify-end close_icon'>
                        <span 
                        className='text-slate-950 font-black'
                        onClick={hideSidebar}
                        >
                            <CloseIcon  fontSize='large' />
                        </span>
                  </div>
                  <div className='bg-yellow-400 w100 text-center'>Navigation Links</div>
                <ul className='flex flex-col items-center justify-center navs_mobile'>
                  <li onClick={hideSidebar} className={`nav-links  `}>
                    <Link className={`hover_links relative ${isActive('/')}`} to='/'>
                      <div className='p-1'><HomeIcon fontSize='large'/></div>
                    </Link>
                  </li>
                  <li onClick={hideSidebar} className={`nav-links cart-container`}>
                        <Link className={`hover_links relative ${isActive('/cart')}`} to='/cart'>
                        <span className="cart-text p-1">
                        <ShoppingCartIcon fontSize='large'/>
                        </span>
                        <span className="cart-badge p-1 text-xs">{cartItemsLength}</span>
                        </Link>
                  </li>
                  <li onClick={hideSidebar} className={`nav-links`}>
                        <Link className={`hover_links relative sign_btn ${isActive('/chat-with-us')}`} to='/chat-with-us'>
                          <div className='p-1'>Chat With Us</div>
                        </Link>
                      </li>
                  <li onClick={hideSidebar} className={`nav-links`}>
                    <Link className={`hover_links relative ${isActive('/shop')}`} to='/shop'>
                      <div className='p-1'><AddShoppingCartIcon fontSize='large'/></div>
                    </Link>
                  </li>
                  {isAuthenticated() && isAuthenticated().user.role === 0 ? (userDashboardRoute()) : null  }
                  {isAuthenticated() && isAuthenticated().user.role === 1 ? (adminDashboardRoute()) : null  }
                  {!isAuthenticated() && (
                    <>
                      <li onClick={hideSidebar} className={`nav-links `}>
                        <Link className={`hover_links relative sign_btn ${isActive('/signin')}`} to='/signin'>
                          <div className='p-1'>Login</div>
                        </Link>
                      </li>
                      <li onClick={hideSidebar} className={`nav-links`}>
                        <Link className={`hover_links relative sign_btn ${isActive('/signup')}`} to='/signup'>
                          <div className='p-1'>Sign Up</div>
                        </Link>
                      </li>
                      </>
                  )  }
                  {isAuthenticated()&&(
                    (
                      
                      <li  className='nav-links' style={{ cursor: 'pointer', color: '#ffffff' }}>
                        <span onClick={handleSignOut}>
                          <div className='p-1'><LogoutIcon style={{color:'#000000'}} fontSize='large'/></div>
                        </span>
                      </li>
                      
                    )
                  )}
                </ul>
          </div> 
      </div>
      </div>
    </header>
  );
};

export default Menu;

