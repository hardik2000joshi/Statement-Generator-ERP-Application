import { useEffect, useState } from "react";
export const Industries = () => {
    const API_URL = "http://localhost:3006/api/industries";
    const [industries, setIndustries] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",    
    })
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchIndustries = async ()  => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(API_URL);
        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message || "Failed to fetch industries");
        }
         console.log("Industries API response:", data);
        setIndustries(data.industries || []);
      }
      catch(error){
        console.error("Fetch industries error: ", error);
        setError(error.message);
      }
      finally{
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchIndustries();
    }, []);

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleAddIndustry = () => {
        setEditingId(null);
        setFormData({
            name: "",
            description: "",
        });
        setError("");
        setShowForm(true);
    };

     // EDIT INDUSTRY
  const handleEdit = (industry) => {
    setEditingId(industry._id);
    setFormData({
      name: industry.name,
      description: industry.description,
    });
    setError("");
    setShowForm(true);
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  // CANCEL
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
    resetForm();
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (!formData.name.trim() || !formData.description.trim()) {
        setError("Name and description are required");
        return;
      }
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

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
            `Failed to ${editingId ? "update" : "create"} industry`
        );
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchIndustries();
    } catch (error) {
      console.error("Industry submit error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete industry"
        );
      }
      fetchIndustries();
    } catch (error) {
      console.error("Delete industry error:", error);
      setError(error.message);
    }
  };
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
           <header className="w-full h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-8">

        <h2 className="text-xl font-semibold text-slate-800">
          Industries
        </h2>

        <button
          onClick={handleAddIndustry}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Add New Industry
        </button>
        </header>


         <section className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Industries
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage industries used by your companies.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

         {/* LOADING */}
        {loading && industries.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading industries...
          </div>
        ) : industries.length === 0 ? (

          /* EMPTY STATE */
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">

            <h3 className="text-lg font-semibold text-gray-800">
              No industries yet.
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first industry to get started.
            </p>

            <button
              onClick={handleAddIndustry}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Add New Industry
            </button>

          </div>

        ) : (

          /* INDUSTRY CARDS */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry) => (
              <div
                key={industry._id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <h2 className="text-xl font-bold text-slate-900">
                  {industry.name}
                </h2>

                <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-600">
                  {industry.description}
                </p>


                {/* ACTIONS */}
                <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleEdit(industry)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(industry._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>


         {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            {/* FORM HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingId
                  ? "Edit Industry"
                  : "Create New Industry"}
              </h2>

              <button
                onClick={handleCancel}
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                x
              </button>

            </div>


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Industry Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter industry name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>


                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter industry description"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

              </div>


              {/* BUTTONS */}
              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                      ? "Update Industry"
                      : "Create Industry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
    )
}