import { useEffect, useState } from "react";
import {
  Box,
  Tag,
  CurrencyRupee,
  FileText,
  Image as ImageIcon,
} from "react-bootstrap-icons";
import "../statics/SellProduct.css"; // keep custom css

function SellProduct() {
  const [data, setData] = useState({
    product_name: "",
    catagory: "",
    product_image: null,
    product_price: "",
    product_description: "",
  });

  const [catagory, setCatagory] = useState([]);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/catagories")
      .then((response) => response.json())
      .then((response) => setCatagory(response))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "product_image") {
      setData((data) => ({ ...data, product_image: files[0] }));
    } else {
      setData((data) => ({ ...data, [name]: value }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!data.product_name) newErrors.product_name = "Product name is required";
    if (!data.catagory) newErrors.catagory = "Category is required";
    if (!data.product_image) newErrors.product_image = "Product image is required";
    if (!data.product_price || isNaN(data.product_price))
      newErrors.product_price = "Enter a valid price";
    if (!data.product_description)
      newErrors.product_description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      const res = await fetch("http://localhost:3000/productSell", {
        method: "post",
        headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`},
        body: formData,
      });

      const response = await res.json();
      if (res.ok) {
        setResponse(response);
        setErr(null);
      } else {
        setErr(response);
      }
    } catch (error) {
      setErr({ error: "Something went wrong" });
    }
  };

  return (
    <div className="sell-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card sell-card shadow-lg border-0 rounded-4 p-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          <Box className="me-2" />
          List Your Product
        </h2>

        <form onSubmit={handleSubmit} className="needs-validation">
          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label">
              <Tag className="me-2 text-secondary" />
              Product Name
            </label>
            <input
              type="text"
              className={`form-control rounded-3 ${errors.product_name ? "is-invalid" : ""}`}
              name="product_name"
              value={data.product_name}
              onChange={handleChange}
              placeholder="e.g. iPhone 14 Pro"
            />
            {errors.product_name && (
              <div className="invalid-feedback">{errors.product_name}</div>
            )}
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">
              <Tag className="me-2 text-secondary" />
              Category
            </label>
            <select
              className={`form-select rounded-3 ${errors.catagory ? "is-invalid" : ""}`}
              name="catagory"
              value={data.catagory}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              {catagory.map((item, index) => (
                <option key={index} value={item.catagory_name}>
                  {item.catagory_name}
                </option>
              ))}
            </select>
            {errors.catagory && (
              <div className="invalid-feedback">{errors.catagory}</div>
            )}
          </div>

          {/* Product Image */}
          <div className="mb-3">
            <label className="form-label">
              <ImageIcon className="me-2 text-secondary" />
              Product Image
            </label>
            <input
              type="file"
              className={`form-control rounded-3 ${errors.product_image ? "is-invalid" : ""}`}
              name="product_image"
              onChange={handleChange}
            />
            {errors.product_image && (
              <div className="invalid-feedback">{errors.product_image}</div>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">
              <CurrencyRupee className="me-2 text-secondary" />
              Price (₹)
            </label>
            <input
              type="text"
              className={`form-control rounded-3 ${errors.product_price ? "is-invalid" : ""}`}
              name="product_price"
              value={data.product_price}
              onChange={handleChange}
              placeholder="Enter product price"
            />
            {errors.product_price && (
              <div className="invalid-feedback">{errors.product_price}</div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">
              <FileText className="me-2 text-secondary" />
              Description
            </label>
            <textarea
              className={`form-control rounded-3 ${errors.product_description ? "is-invalid" : ""}`}
              name="product_description"
              value={data.product_description}
              onChange={handleChange}
              rows="3"
              placeholder="Write a short description..."
            />
            {errors.product_description && (
              <div className="invalid-feedback">{errors.product_description}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
          >
            <Box className="me-2" />
            Publish Product
          </button>
        </form>

        {/* Success / Error Messages */}
        {response && <div className="alert alert-success mt-3">{response.message}</div>}
        {err && <div className="alert alert-danger mt-3">{err.error}</div>}
      </div>
    </div>
  );
}

export default SellProduct;
