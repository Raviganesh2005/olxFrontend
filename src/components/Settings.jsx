import { useEffect, useState } from "react";
import "../statics/Settings.css";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [data, setData] = useState(null); // user info
  const [orders, setOrders] = useState([]); // selling status (orders)
  const [products, setProducts] = useState([]); // uploaded products
  const [soldout, setSoldout] = useState([]); // completed orders (soldout)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyingOrders, setBuyingOrders] = useState([])

  const [showDetails, setShowDetails] = useState(false);
  const [showOrders, setShowOrders] = useState(true);
  const [showBuying, setShowBuying] = useState(true);
  const [showUploads, setShowUploads] = useState(true);
  const [showSoldout, setShowSoldout] = useState(true);

  const navigate = useNavigate();
  const id = localStorage.getItem("userId");

  // Fetch user info
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:3000/settings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const responseData = await res.json();
        if (res.ok && Array.isArray(responseData) && responseData.length > 0) {
          setData(responseData[0]);
        } else {
          setError("No user data found");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSettings();
  }, [id]);

  // Fetch soldout orders
useEffect(() => {
  const fetchSoldout = async () => {
    try {
      const res = await fetch("http://localhost:3000/settings/soldout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await res.json();
      if (res.ok || res.status === 200) setSoldout(response);
    } catch (err) {
      console.log(err);
    }
  };
  fetchSoldout();
}, []);


  // Fetch selling orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/settings/sellStatus", {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const response = await res.json();
        if (res.ok || res.status === 200) setOrders(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  // Fetch uploaded products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/settings/sellUpload", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const response = await res.json();
        if (res.ok || res.status === 200) setProducts(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  // Delete uploaded product
  const handleDelete = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/settings/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const fetchBuying = async () => {
    try {
      const res = await fetch("http://localhost:3000/settings/buying", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await res.json();
      if (res.ok || res.status === 200) setBuyingOrders(response);
    } catch (err) {
      console.log(err);
    }
  };
  fetchBuying();
}, []);

  const handleAccept = async (orderId, productId) => {
  const confirmAccept = window.confirm(
    "Are you sure you want to mark this order as Completed?"
  );
  if (!confirmAccept) return;

  try {
    const res = await fetch(
      `http://localhost:3000/settings/accept/${orderId}/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.ok) {
      const acceptedOrder = orders.find((o) => o._id === orderId);
      const updatedOrder = { ...acceptedOrder, order_status: "completed" };

      // Move from orders to soldout
      setOrders(orders.filter((o) => o._id !== orderId));
      setSoldout([...soldout, updatedOrder]);

      
      const prodRes = await fetch("http://localhost:3000/settings/sellUpload", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (prodRes.ok) {
        const updatedProducts = await prodRes.json();
        setProducts(updatedProducts);
      }
    }
  } catch (err) {
    console.log(err);
  }
};



  const handleCancel = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `http://localhost:3000/settings/cancel/${orderId}`,
        {
          method: "delete",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== orderId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Logout
  const handleLogout = () => {

    navigate("/logout");
  };

  if (loading) return <p className="text-center mt-5">Loading settings...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  const profile = data?.profile || {};
  const username = data?.username || "User";
  const email = profile?.email || data?.email;
  const location = profile?.address || data?.state;
  const role = data?.role || "user";
  const image = profile?.image
    ? `http://localhost:3000/${profile.image}`
    : "https://via.placeholder.com/100";
  
  


  return (
    <div className="container py-4 settings-container">
      <div className="card shadow-lg rounded-4 p-4">
        {/* Profile Section */}
        <div className="d-flex align-items-center profile-section">
          <img src={image} alt="profile" className="profile-img rounded-circle" />
          <div className="ms-3">
            <h4 className="fw-bold">{username}</h4>
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        {showDetails && (
          <div className="mt-3 profile-details p-3 rounded bg-light">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Mobile:</strong> {profile?.mobile || "N/A"}</p>
            <p><strong>DOB:</strong> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}</p>
            <button className="btn btn-primary btn-sm mt-2" onClick={()=>navigate("/update")}>Update Profile</button>
          </div>
        )}

        {/* Selling Status Section */}
        <div className="mt-4">
          <div
            className="section-header d-flex justify-content-between align-items-center"
            onClick={() => setShowOrders(!showOrders)}
          >
            <h5 className="fw-bold">Selling Status (Orders)</h5>
            <span className="toggle-btn">{showOrders ? "−" : "+"}</span>
          </div>
          {showOrders && (
            <div className="row mt-2">
              {orders.length > 0 ? (
                orders.map((item) => (
                  <div key={item._id} className="col-md-6 mb-3">
                    <div className="card shadow-sm h-100">
                      <div className="row g-0">
                        <div className="col-4">
                          <img
                            src={item.product_imageUrl || "https://via.placeholder.com/150"}
                            className="img-fluid rounded-start"
                            alt={item.product_name}
                          />
                        </div>
                        <div className="col-8">
                          <div className="card-body">
                            <h6 className="card-title">{item.product_name}</h6>
                            <p className="mb-1"><strong>Price:</strong> ₹{item.product_price}</p>
                            <p className="mb-1">
                              <strong>Status:</strong>{" "}
                              <span className={`badge ${item.order_status === "processing" ? "bg-warning" : item.order_status === "accepted" ? "bg-success" : "bg-danger"}`}>
                                {item.order_status}
                              </span>
                            </p>
                            <hr />
                            <p className="mb-1"><strong>Buyer:</strong> {item.buyer_name}</p>
                            <p className="mb-1"><strong>Mobile:</strong> {item.buyer_mobile || "N/A"}</p>
                            <div className="mt-2 d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleAccept(item._id,item.product_id)}
                                disabled={item.order_status !== "processing"}
                              >
                                Complete
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancel(item._id)}
                                disabled={item.order_status !== "processing"}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => navigate("/chat",{state:item.buyer_name})}
                              >
                                ChatNow
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No selling orders found.</p>
              )}
            </div>
          )}
        </div>

        {/* Uploaded Products Section */}
        <div className="mt-4">
          <div
            className="section-header d-flex justify-content-between align-items-center"
            onClick={() => setShowUploads(!showUploads)}
          >
            <h5 className="fw-bold">Uploaded Products</h5>
            <span className="toggle-btn">{showUploads ? "−" : "+"}</span>
          </div>
          {showUploads && (
            <div className="mt-2">
              {products.length > 0 ? (
                <div className="row">
                  {products.map((item) => (
                    <div key={item._id} className="col-md-4 mb-3">
                      <div className="card h-100">
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/150"}
                          className="card-img-top"
                          alt={item.product_name}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{item.product_name}</h6>
                          <p>Status: <span className="text-success">{item.status}</span></p>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No uploaded products found.</p>
              )}
            </div>
          )}
        </div>

        {/* Soldout Products Section */}
        <div className="mt-4">
          <div
            className="section-header d-flex justify-content-between align-items-center"
            onClick={() => setShowSoldout(!showSoldout)}
          >
            <h5 className="fw-bold">Soldout Products</h5>
            <span className="toggle-btn">{showSoldout ? "−" : "+"}</span>
          </div>
          {showSoldout && (
            <div className="mt-2">
              {soldout.length > 0 ? (
                <div className="row">
                  {soldout.map((item) => (
                    <div key={item._id} className="col-md-4 mb-3">
                      <div className="card h-100 border-success">
                        <img
                          src={item.product_imageUrl || "https://via.placeholder.com/150"}
                          className="card-img-top"
                          alt={item.product_name}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{item.product_name}</h6>
                          <p>Status: <span className="badge bg-success">Completed</span></p>
                          <p><strong>Buyer:</strong> {item.buyer_name}</p>
                          <p><strong>Mobile:</strong> {item.buyer_mobile || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No soldout products yet.</p>
              )}
            </div>
          )}
        </div>

          {/* Buying Section */}
<div className="mt-4">
  <div
    className="section-header d-flex justify-content-between align-items-center"
    onClick={() => setShowBuying(!showBuying)}
  >
    <h5 className="fw-bold">Buying History</h5>
    <span className="toggle-btn">{showBuying ? "−" : "+"}</span>
  </div>
  {showBuying && (
    <div className="row mt-2">
      {buyingOrders.length > 0 ? (
        buyingOrders.map((item) => (
          <div key={item._id} className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="row g-0">
                <div className="col-4">
                  <img
                    src={item.product_imageUrl || "https://via.placeholder.com/150"}
                    className="img-fluid rounded-start"
                    alt={item.product_name}
                  />
                </div>
                <div className="col-8">
                  <div className="card-body">
                    <h6 className="card-title">{item.product_name}</h6>
                    <p className="mb-1"><strong>Price:</strong> ₹{item.product_price}</p>
                    <p className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          item.order_status === "processing"
                            ? "bg-warning"
                            : item.order_status === "completed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.order_status}
                      </span>
                    </p>
                    <hr />
                    <p className="mb-1"><strong>Seller:</strong> {item.seller_name}</p>
                    <p className="mb-1"><strong>Mobile:</strong> {item.seller_mobile || "N/A"}</p>
                    <button
                    className="btn btn-success btn-sm"
                    onClick={() => navigate("/chat",{state:item.seller_name})}
                    >
                    ChatNow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No buying history found.</p>
      )}
    </div>
  )}
</div>


        {/* Logout */}
        <div className="mt-4 text-center">
          <button className="btn btn-danger btn-lg" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
