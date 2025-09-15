import { useState } from "react";
import "../statics/Login.css"; 
import { Link, useNavigate } from "react-router-dom";

function Login({ setToken }) {
  

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((data) => {
      return { ...data, [name]: value };
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.ok) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("role",response.role)
        setToken(response.token)
        setError(null);
        navigate("/home")
        
      } else {
        setError(response);
      }
    } catch (error) {
      setError({ error: "Something went wrong" });
    }
  };


  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="login-card p-4 shadow-sm rounded">
        {/* Back Button */}
        <button
          className="btn btn-link text-decoration-none mb-3"
          onClick={() => window.history.back()}
        >
          &larr; Back
        </button>

        <h3 className="mb-4 text-center">Login</h3>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-bold">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={data.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        {error && <p className="text-danger text-center">{error.error}</p>}

        {/* Register Link */}
        <p className="text-center">
          Not registered?{" "}
          <Link to="/register" className="text-decoration-none fw-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
