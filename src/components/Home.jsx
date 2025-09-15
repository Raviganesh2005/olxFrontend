import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../statics/Home.css";

function Home({ token }) {
  const [catagories, setCatagories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/catagories")
      .then((res) => res.json())
      .then((data) => setCatagories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/productSell");
        const data = await res.json();

        if (res.ok) {
          setProducts(data);
        } else {
          setError(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);


  

  return (
    <div>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <div className="container-fluid">
          <div className="d-flex gap-2">
            {catagories.map((cat) => (
              <button
                key={cat._id}
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate(`/products/${cat._id}`)}
              >
                {cat.catagory_name}
              </button>
            ))}
          </div>

          <div className="ms-auto d-flex gap-2">
            {!token && (
              <Link to="/login" className="btn btn-warning">
                Login
              </Link>
            )}

            {token && (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/sellNow")}
                >
                  Sell Now
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    navigate("/logout");
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <div className="container mt-4">
        {products.map((cat, i) => (
          <div key={i} className="mb-5">
            <h4 className="mb-3">{cat.catagory_name}</h4>
            <div className="row">
              {cat.products.map((p, j) => (
                <div
                  className="col-md-4 mb-3"
                  key={j}
                  onClick={() => navigate(`/products/${cat.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        className="card-img-top"
                        alt={p.product_name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center"
                        style={{ height: "200px", color: "white" }}
                      >
                        No Image
                      </div>
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{p.product_name}</h5>
                      <p className="card-text text-muted">
                        Price: ₹{p.product_price}
                      </p>
                      <button className="btn btn-primary">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate(`/products/${cat.id}`)}
              >
                More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
