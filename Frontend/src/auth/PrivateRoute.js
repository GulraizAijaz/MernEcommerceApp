import { isAuthenticated } from "./index";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

export const AdminRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            Swal.fire({
                title: 'Sign in first?',
                text: 'for going to dashboard, you need to sign in first',
                icon: 'question',
                confirmButtonText: 'Sign In'
              }).then((res) => {
                if (res.isConfirmed){
                 navigate('/signin')
                }
              });
        }
    }, [navigate]);

    return isAuthenticated() && isAuthenticated().user.role === 0  ? children : '(Customer routes!)';
};

export default AdminRoute;
