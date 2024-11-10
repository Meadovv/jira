import React from "react";
import axios from "axios";
import configs from "../.configs";
import { useNavigate } from "react-router-dom";

function PrivateRouter({ children, enabled }) {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const removeToken = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        setIsAuthenticated(false);
        navigate("/login");
    }

    const verifyToken = async () => {
        await axios.post(`${configs.API_URL}/auth/verify`, {

        }, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
        .then(res => {
            const role = res.data.auth.role;
            if(enabled.includes(role)) {
                localStorage.setItem("auth", JSON.stringify(res.data.auth));
                setIsAuthenticated(true);
            } else {
                removeToken();
            }
        })
        .catch(_ => {
            removeToken();
        })
    }

    React.useEffect(() => {
        verifyToken();
    }, []);

    if (isAuthenticated) {
        return children;
    } else {
        return null;
    }
}

export default PrivateRouter;