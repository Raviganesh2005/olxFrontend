import { useNavigate, Link } from "react-router-dom";
import "../statics/Header.css";
import { Gear, BoxArrowRight } from "react-bootstrap-icons"; // Bootstrap Icons

function Header({ location, setLocation, productName, setProductName, token }) {
  const states = [
    "All","Andaman and Nicobar Islands","Andhra Pradesh", "Arunachal Pradesh","Assam","Bihar",
    "Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh", "Uttarakhand",  "West Bengal",
  ];

  const navigate = useNavigate();

  return (
    <header className="header bg-white shadow-sm py-3">
      <div className="container">
        <div className="row align-items-center g-3">

          {/* Logo */}
          <div className="col-12 col-md-2 d-flex justify-content-center justify-content-md-start">
            <h2 className="logo m-0">OLX</h2>
          </div>

          {/* Location Dropdown */}
          <div className="col-12 col-md-3">
            <label htmlFor="location" className="form-label fw-bold small">
              Location
            </label>
            <select
              className="form-select form-select-sm rounded-pill"
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="col-12 col-md-5">
            <label htmlFor="filterProducts" className="form-label fw-bold small">
              Search Products
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="filterProducts"
              placeholder="What are you looking for?"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
            />
          </div>

          {/* Right Side Actions */}
          <div className="col-12 col-md-2 d-flex justify-content-center justify-content-md-end align-items-center gap-3 mt-3 mt-md-0">

            {token && (
              <div className="d-flex align-items-center gap-3">
                {/* Sell Button */}
                <Link to="/sellNow" className="btn btn-success rounded-pill fw-semibold px-4 mt-4">
                  Sell
                </Link>

                {/* Settings Icon */}
                <Link to="/settings" className="icon-link mt-4">
                  <Gear size={24} />
                </Link>

                {/* Logout Icon */}
                <Link to="/logout" className="icon-link text-danger mt-4">
                  <BoxArrowRight size={24} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
