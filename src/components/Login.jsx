import { useState } from "react";
import "../statics/Login.css"; 
import { Link, useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("https://olxbackend-0mmr.onrender.com/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.username);
        localStorage.setItem("userId", result.id);
        localStorage.setItem("role", result.role);

        setToken(result.token);
        setResponse({ message: "✅ Logged in successfully!" });

        // Give user a short success message before navigating
        setTimeout(() => {
          navigate("/home");
        }, 800);
      } else {
        setError({ error: result.error || result.message || "Login failed" });
      }
    } catch (err) {
      setError({ error: "⚠️ Something went wrong, try again later." });
    } finally {
      setLoading(false);
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
              required
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
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Messages */}
        {response && <p className="text-success text-center">{response.message}</p>}
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
