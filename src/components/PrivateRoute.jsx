import { Navigate,Outlet } from "react-router-dom"

function PrivateRoute({ token }) {
    
    if (!token) {
        
        return <Navigate to="/login"></Navigate>
    }
    else {
        
        return <Outlet  />
    }
    

}

export default PrivateRoute