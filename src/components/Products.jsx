import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../statics/Products.css"; // custom css
import Login from "./Login";

function Products({location,productName}) {
  const { id } = useParams();

  const [products, setProducts] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    console.log("Category ID:", id);

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `https://olxbackend-0mmr.onrender.com/productSell/category/${id}`,
          {
            method: "get",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const data = await res.json();
        if (location === "All") {
          
          setProducts(data.filter((item) => (
            
            location === "All" && item.product_name.includes(productName)
            
          )));

        }
        
        else {
        setProducts(
          data.filter(
            (item) =>
              location === item.seller?.profile.state && item.product_name.includes(productName)
          )
        );
        }
        

      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [location,productName]);

  

  return (
    <div className="container py-4">
      {/* Header with back button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">All Products</h3>
        <Link to="/home" className="btn btn-outline-primary back-btn">
          ← Back to Home
        </Link>
      </div>

      <div className="row g-4">
        {products.map((p, i) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={i} onClick={()=>navigate(`/productDetail/${p._id}`)} >
            <div className="card product-card h-100 shadow-sm border-0">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.product_name}
                  className="card-img-top product-img"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <div className="card-body text-center">
                <h6 className="card-title mb-2">{p.product_name}</h6>
                <p className="card-text fw-bold text-success">
                  ₹{p.product_price}
                </p>
                <button className="btn btn-sm btn-primary w-100">View</button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-muted text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;
