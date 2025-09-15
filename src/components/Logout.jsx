import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Logout({ setToken }) {

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("userId")
        localStorage.removeItem("role")
        setToken(null);
        navigate("/home")
    },[])


}

export default Logout