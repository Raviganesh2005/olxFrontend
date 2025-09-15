import { useState, useEffect } from "react";

function UpdateProfile() {
  const [data, setData] = useState({
    name: "",
    image: "",
    address: "",
    state: "",
    mobile: "",
    email: "",
    dob: "",
    role: "user",
  });
    
const states = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ];

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [regErr, setRegErr] = useState(null);


  const mobileRegex = /^[0-9]{10}$/;

  
  useEffect(() => {
      fetch("http://localhost:3000/update", {
        method:"get",
        headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, 
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.profile) {
          setData({
            name: result.profile.name || "",
            image: "", 
            address: result.profile.address || "",
            state: result.profile.state || "",
            mobile: result.profile.mobile || "",
            email: result.profile.email || "",
            dob: result.profile.dob ? result.profile.dob.slice(0, 10) : "",
            role: result.profile.role || "admin",
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      setData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!mobileRegex.test(data.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }
    if (!data.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!data.state) {
      newErrors.state = "Please select your state.";
    }
    if (!data.name) {
      newErrors.name = "Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      Object.keys(data).forEach((item) => {
        formData.append(item, data[item]);
      });

      fetch("http://localhost:3000/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        body: formData,
      })
        .then(async (res) => {
          const result = await res.json();
          if (res.ok) {
            setResponse(result);
            setRegErr(null);
          } else {
            setRegErr(result);
            setResponse(null);
          }
        })
        .catch((err) => {
          console.error(err);
          setRegErr({ error: "Server error. Please try again later." });
        });
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="register-card shadow-lg rounded p-4">
        <h2 className="text-center mb-4 fw-bold text-orange">Update Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            
            <div className="col-md-6">
              <label className="form-label">Mobile</label>
              <input
                type="text"
                className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                name="mobile"
                value={data.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
              {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
            </div>

            
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={data.dob}
                onChange={handleChange}
              />
            </div>

            
            <div className="col-md-6">
              <label className="form-label">State</label>
              <select
                className={`form-select ${errors.state ? "is-invalid" : ""}`}
                name="state"
                value={data.state}
                onChange={handleChange}
              >
                <option value="">Select state</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <div className="invalid-feedback">{errors.state}</div>}
            </div>

           
            <div className="col-md-6">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleChange}
              />
            </div>

            
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                rows="2"
                name="address"
                value={data.address}
                onChange={handleChange}
                placeholder="Enter your address"
              ></textarea>
            </div>
          </div>

          
          <button type="submit" className="btn btn-orange w-100 mt-4">
            Update
          </button>
        </form>

        
        {response && <p className="text-success mt-3">{response.message}</p>}
        {regErr && <p className="text-danger mt-3">{regErr.error || regErr.message}</p>}
      </div>
    </div>
  );
}

export default UpdateProfile;
