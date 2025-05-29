import { isAuthenticated } from "./index";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

export const UnAuthRoutes = ({ children }) => {
    const navigate = useNavigate();

   useEffect(() => {
    if (isAuthenticated()) {
      Swal.fire({
        title: 'Return To Home',
        text: "Already Signed in!",
        icon: 'warning',
        confirmButtonText: 'Okay'
      }).then(res => {
        if (res.isConfirmed) {
          navigate('/');
        }
      });
    }
  }, [isAuthenticated(), navigate]);

  return !isAuthenticated() ? children : null; 
};

export default UnAuthRoutes;
