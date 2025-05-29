// menuData.js
export const menuData = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Search",
    url: "/search",
  },
  {
    title: "Cart",
    url: "/cart",
  },
  {
    title: "Shop",
    url: "/shop",
  },
  {
    title: "Dashboard",
    submenu: [
      {
        title: "User Dashboard",
        url: "user/dashboard",
      },
      {
        title: "Admin Dashboard",
        url: "admin/dashboard",
      },
    ],
  },
  {
    title: "Login",
    url: "/signin",
  },
  {
    title: "Register",
    url: "/signup",
  },
];
