import { useEffect, useState } from "react";
import { PlusCircle, Tag } from "react-bootstrap-icons";
import "../statics/CatagoryPage.css"

function CategoryPage() {

  const [categories, setCategories] = useState([]);
  const [catagory_name, setCategoryName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
        const res = await fetch("https://olxbackend-0mmr.onrender.com/catagories", {
          
            method: "get",
            headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catagory_name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const res = await fetch("https://olxbackend-0mmr.onrender.com/catagories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify({ catagory_name }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message || "Category added successfully");
        setError(null);
        setCategoryName("");
        fetchCategories(); // refresh list
      } else {
        setError(data.error || "Failed to add category");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="category-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4 category-card">
        <h2 className="text-center mb-4 text-primary fw-bold">
          <Tag className="me-2" />
          Manage Categories
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control rounded-start"
              placeholder="Enter category name"
              value={catagory_name}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary fw-semibold rounded-end"
            >
              <PlusCircle className="me-1" />
              Add
            </button>
          </div>
          {error && <div className="text-danger mt-2 small">{error}</div>}
          {response && <div className="text-success mt-2 small">{response}</div>}
        </form>

        {/* Categories List */}
        <h5 className="fw-bold mb-3">Available Categories</h5>
        <ul className="list-group list-group-flush">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center"
              >
                <Tag className="me-2 text-secondary" />
                {cat.catagory_name}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              No categories available
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CategoryPage;
