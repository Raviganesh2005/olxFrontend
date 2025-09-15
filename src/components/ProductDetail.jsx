import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "../statics/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://olxbackend-0mmr.onrender.com/product/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const responseData = await res.json();

        if (res.ok) {
          setData(responseData);
        } else {
          setError(responseData.error || "Failed to fetch product");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkBook = async () => {
      try {
        const res = await fetch(`https://olxbackend-0mmr.onrender.com/product/checkBook/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const response = await res.json();

        if (res.ok) {
          setStatus(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkBook();
  }, [id]);

  const handleBook = async () => {
    try {
      const res = await fetch(`https://olxbackend-0mmr.onrender.com/product/book/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await res.json();

      if (res.ok && response.message === "booked") {
        setStatus("booked");
      } else if (response.message === "already_booked") {
        setStatus("booked");
      } else {
        setError(response.error || "Booking failed");
      }
    } catch {
      setError("Something went wrong while booking");
    }
  };



  if (loading) return <p className="text-center mt-5">Loading product details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!data) return null;

  return (
    <div className="container py-4 product-detail-container">
      <div className="card shadow-lg rounded-4 p-4">
        {/* Product Image & Info */}
        <div className="row align-items-start">
          <div className="col-md-6 text-center">
            <img
              src={data.imageUrl || "https://via.placeholder.com/300"}
              alt={data.product_name}
              className="img-fluid rounded product-img"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">{data.product_name}</h2>
            <h4 className="text-success">₹{data.product_price}</h4>
            <div className="mt-3">
              <h5>Description</h5>
              <p>{data.product_description}</p>
            </div>

            {status !== "booked" ? (
              <button className="btn btn-primary btn-lg mt-3" onClick={handleBook}>
                Book Now
              </button>
            ) : (
              <button className="btn btn-secondary btn-lg mt-3" disabled>
                Booked
              </button>
            )}
          </div>
        </div>

        {/* Seller Details */}
        {data.seller && (
          <div className="mt-5 seller-section p-3 bg-light rounded">
            <h4>Seller Details</h4>
            <div className="d-flex align-items-center mt-3">
              <img
                src={
                  data.seller.profile?.image
                    ? `https://olxbackend-0mmr.onrender.com/${data.seller.profile.image}`
                    : "https://via.placeholder.com/80"
                }
                alt={data.seller.username}
                className="rounded-circle seller-img me-3"
              />
              <div>
                <p>
                  <strong>Name:</strong> {data.seller.username}
                </p>
                <p>
                  <strong>Contact:</strong> {data.seller.profile?.mobile || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {data.seller.profile?.address || "N/A"}
                </p>

                
                <button className="btn btn-success mt-3" onClick={()=>navigate("/chat",{state:data.seller.username})} >
                  💬 Chat Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
