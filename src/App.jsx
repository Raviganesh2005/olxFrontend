import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Logout from './components/Logout';
import SellProduct from './components/SellProduct';
import CategoryPage from './components/CatagoryPage';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Settings from "./components/Settings"
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import UpdateProfile from './components/UpdateProfile';
import Chating from './components/Chating';


function AppRoutes() {
  
  const locationHook = useLocation();

  const [location, setLocation] = useState("All");
  const [productName, setProductName] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));


  const hideHeaderPaths = [
    "/",
    "/home",
    "/login",
    "/register",
    "/sellNow",
    "/logout",
    "/settings",
    "/update",
    "/chat",
  ];

  const showHeader =
    !hideHeaderPaths.includes(locationHook.pathname) &&
    !locationHook.pathname.startsWith("/productDetail/");

  return (
    <>
      {showHeader && (
        <Header
          location={location}
          setLocation={setLocation}
          productName={productName}
          setProductName={setProductName}
          token={token}
        />
      )}

      <Helmet>
        <title>
          {locationHook.pathname === "/login" ? "login" :
            locationHook.pathname === "/register" ? "register" :
              locationHook.pathname === "/sellNow" ? "sellNow" :
                locationHook.pathname === "/settings" ? "settings" :
                  locationHook.pathname.startsWith("/product") ? "products" :
                    locationHook.pathname.startsWith("productDetail") ? "ProductDetail" :
                      locationHook.pathname === "/chat" ? "chat" :
                        "Home"
            }
        </title>
      </Helmet>

      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/home" element={<Home token={token} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute token={token} />}>
          <Route path="/products/:id" element={<Products location = {location}  productName = {productName} />} />
          <Route path="/sellNow" element={<SellProduct />} />
          <Route path="/settings" element={<Settings />} />
          <Route path='/productDetail/:id' element={<ProductDetail />}></Route>
          <Route path='/update' element={<UpdateProfile />}></Route>
          <Route path='/chat' element={<Chating />}></Route>
        </Route>
        <Route path="/logout" element={<Logout setToken={setToken} />} />
        {role === "admin" && (
          <Route path="/catagory" element={<CategoryPage />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
