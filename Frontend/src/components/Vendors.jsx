import { useEffect, useState } from "react";
const vendors_Api = "http://localhost:3006/api/vendors";
const category_Api = "http://localhost:3006/api/category";
export const Vendors = () => {
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    outgoingMin: "",
    outgoingMax: "",
    incomingMin: "",
    incomingMax: "",
    weekendActivity: "",
  });

  // reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      outgoingMin: "",
      outgoingMax: "",
      incomingMin: "",
      incomingMax: "",
      weekendActivity: "",
    });
  };

  // fetch vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(vendors_Api);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch vendors");
      }
      setVendors(data.vendors || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(category_Api);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // create / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const url = editingId ? `${vendors_Api}/${editingId}` : vendors_Api;
      const method = editingId ? "PUT" : "POST";
      const body = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        outgoingMin: Number(formData.outgoingMin),
        outgoingMax: Number(formData.outgoingMax),
        incomingMin: Number(formData.incomingMin),
        incomingMax: Number(formData.incomingMax),
        weekendActivity: Number(formData.weekendActivity),
      };
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${editingId ? "update" : "create"} vendor`,
        );
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchVendors();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // edit
  const handleEdit = (vendor) => {
    setEditingId(vendor._id);
    setFormData({
      name: vendor.name,
      description: vendor.description || "",
      category: vendor.category?._id || vendor.category || "",
      outgoingMin: vendor.outgoingMin,
      outgoingMax: vendor.outgoingMax,
      incomingMin: vendor.incomingMin,
      incomingMax: vendor.incomingMax,
      weekendActivity: vendor.weekendActivity,
    });
    setShowForm(true);
    setError("");
  };

  // Delete vendors
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vendor?",
    );
    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${vendors_Api}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete vendor");
      }

      setVendors((prev) => prev.filter((vendor) => vendor._id !== id));
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = () => {
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

  const getCategoryName = (vendor) => {
    if (vendor.category?.name) {
      return vendor.category.name;
    }
    const category = categories.find(
      (item) => item._id === vendor.category
    );
    return category?.name || "Unknown Category";
  };

  return (
    <div className="min-h-screen p-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 p-6 mt-10">
            Vendors
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage vendors and their transaction generation rules.
          </p>
        </div>
        <button
          onClick={handleAddVendor}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          Add Vendor
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {
        showForm && (
             <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId
                ? "Edit Vendor"
                : "Create Vendor"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-xl text-gray-400 hover:text-gray-700"
            >
              X
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Vendor Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. AWS"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* TRANSACTION DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Transaction Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Monthly IT support services"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This text appears in the generated bank statement and invoice.
                </p>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Vendor Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name} (
                      {category.categoryType})
                    </option>
                  ))}
                </select>
              </div>

              {/* OUTGOING MIN */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Outgoing Minimum
                </label>
                <input
                  type="number"
                  name="outgoingMin"
                  value={formData.outgoingMin}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="10000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* OUTGOING MAX */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Outgoing Maximum
                </label>
                <input
                  type="number"
                  name="outgoingMax"
                  value={formData.outgoingMax}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="50000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* INCOMING MIN */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Incoming Minimum
                </label>
                <input
                  type="number"
                  name="incomingMin"
                  value={formData.incomingMin}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* INCOMING MAX */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Incoming Maximum
                </label>
                <input
                  type="number"
                  name="incomingMax"
                  value={formData.incomingMax}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* WEEKEND ACTIVITY */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Weekend Activity (%)
                </label>
                <input
                  type="number"
                  name="weekendActivity"
                  value={formData.weekendActivity}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  placeholder="20"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Percentage of this vendor's transactions
                  that may occur during weekends.
                </p>
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
                  ? "Update Vendor"
                  : "Create Vendor"}
              </button>
            </div>
            </form>
            </div>
        )}

        {/* VENDOR CARDS */}
      {loading && vendors.length === 0 ? (

        <div className="py-12 text-center text-sm text-gray-500">
          Loading vendors...
        </div>

      ) : vendors.length === 0 ? (

        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">

          <h3 className="text-lg font-semibold text-gray-800">
            No vendors yet.
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create your first vendor to get started.
          </p>

          <button
            onClick={handleAddVendor}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Vendor
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {vendors.map((vendor) => (

            <div
              key={vendor._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* VENDOR NAME */}

              <div className="border-b border-gray-100 pb-4">

                <h2 className="text-xl font-bold text-gray-900">
                  {vendor.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {getCategoryName(vendor)}
                </p>
                {vendor.description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {vendor.description}
                  </p>
                )}

              </div>

              {/* OUTGOING */}

              <div className="mt-5">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Outgoing
                </p>

                <p className="mt-1 text-base font-semibold text-red-600">
                  ₹{Number(vendor.outgoingMin).toLocaleString()}{" "}
                  - ₹{Number(vendor.outgoingMax).toLocaleString()}
                </p>

              </div>

              {/* INCOMING */}

              <div className="mt-4">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Incoming
                </p>

                <p className="mt-1 text-base font-semibold text-green-600">
                  ₹{Number(vendor.incomingMin).toLocaleString()}{" "}
                  - ₹{Number(vendor.incomingMax).toLocaleString()}
                </p>

              </div>

              {/* WEEKEND */}

              <div className="mt-4">

                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Weekend Activity
                </p>

                <div className="mt-2 flex items-center gap-3">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: `${vendor.weekendActivity}%`,
                      }}
                    />

                  </div>

                  <span className="text-sm font-semibold text-gray-700">
                    {vendor.weekendActivity}%
                  </span>
                </div>
                </div>

                {/* ACTIONS */}
              <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleEdit(vendor)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vendor._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              </div>
          ))}
    </div>
      )}
      </div>
  );
};
