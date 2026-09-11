import { useEffect, useState } from "react";

const API_URL = "http://localhost:3006/api/category";
const colorOptions = [
  "BLUE",
  "YELLOW",
  "RED",
  "GREY",
  "GREEN",
  "PURPLE",
  "ORANGE",
  "INDIGO",
];
const colorClasses = {
  BLUE: {
    card: "bg-blue-100 text-blue-700",
  },
  YELLOW: {
    card: "bg-yellow-100 text-yellow-700",
  },
  RED: {
    card: "bg-red-100 text-red-700",
  },
  GREY: {
    card: "bg-grey-100 text-grey-700",
  },
  GREEN: {
    card: "bg-green-100 border-green-700",
  },
  PURPLE: {
    card: "bg-purple-100 border-purple-700",
  },
  ORANGE: {
    card: "bg-orange-100 border-orange-700",
  },
  INDIGO: {
    card: "bg-indigo-100 border-indigo-700",
  },
};
export const VendorCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryType: "",
    colorTheme: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const method = editingId ? "PUT" : "POST";
      console.log("FORM DATA:", formData);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${editingId ? "update" : "create"} category`,
        );
      }

      // Close form
      setShowForm(false);

      // Clear edit state
      setEditingId(null);

      // Reset form
      resetForm();

      // Fetch latest categories
      fetchCategories();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);

    setFormData({
      name: category.name,
      description: category.description,
      categoryType: category.categoryType,
      colorTheme: category.colorTheme,
    });

    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vendor category?",
    );
    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryType: "",
      colorTheme: "",
    });
  };

  const handleAddCategory = () => {
    setEditingId(null);
    resetForm();
    setError("");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Vendor Categories
          </h1>
          <p className="mt-5 text-sm text-gray-500">
            Manage vendor categories and their transaction types.
          </p>
        </div>

        <button
          onClick={handleAddCategory}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Vendor Category" : "Create Vendor Category"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-700 text-xl"
            >
              X
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cloud Services"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Type
                </label>

                <select
                  name="categoryType"
                  value={formData.categoryType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe this vendor category..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* COLOR */}

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Color Theme
                </label>

                <div className="flex flex-wrap gap-3">
                  <select
                    name="colorTheme"
                    value={formData.colorTheme}
                    onChange={handleChange}
                  >
                    <option value="">Select Color</option>
                    <option value="BLUE">Blue</option>
                    <option value="YELLOW">Yellow</option>
                    <option value="RED">Red</option>
                    <option value="GREY">Grey</option>
                    <option value="GREEN">Green</option>
                    <option value="PURPLE">Purple</option>
                    <option value="ORANGE">Orange</option>
                    <option value="INDIGO">Indigo</option>
                  </select>
                </div>
              </div>
            </div>
            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && categories.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No categories yet.
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create your first vendor category to get started.
          </p>

          <button
            onClick={handleAddCategory}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const theme = colorClasses[category.colorTheme] || colorClasses.BLUE;

            return (
              <div
                key={category._id}
                className={`rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${theme.card}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {category.name}
                    </h2>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
                    >
                      {category.categoryType}
                    </span>
                  </div>
                </div>

                <p className="mt-5 min-h-[48px] text-sm leading-6 text-gray-600">
                  {category.description}
                </p>

                <div className="mt-6 flex gap-3 border-t border-gray-200/70 pt-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
