import { isAuthenticated } from "./index";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

export const UnAuthRoutes = ({ children }) => {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (isAuthenticated()) {
    //              navigate('/signup')              
    //     }
    // }, [navigate]);

    return !isAuthenticated() ? children : '(You are sign In Already)';
};

export default UnAuthRoutes;
