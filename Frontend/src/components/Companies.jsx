import { useEffect, useState } from "react";
const company_Url = "http://localhost:3006/api/companies";
const industry_Url = "http://localhost:3006/api/industries";

const companiesData ={
    companyName: "",
    registrationNumber: "",
    gstNumber: "",
    panNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    industryType: "",
    bankDetails: {
        bankName: "",
        accountNumber: "",
        ifscCode: "",
    },
};
export const Company = () => {
    const [companies, setCompanies] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [formData, setFormData] = useState(companiesData);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fetchingCompanies, setFetchingCompanies] = useState(true);
    const [fetchingIndustries, setFetchingIndustries] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    // fetch all companies
    const fetchCompanies = async() => {
        try {
            setFetchingCompanies(true);
            setError("");
            const response = await fetch(company_Url);
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "Failed to fetch companies");
            }
            setCompanies(Array.isArray(data.companies) ? data.companies : []);
        }
        catch(error){
            console.error("Fetch comapanies error: ", error);
            setError(error.message || "Failed to fetch companies");
            setCompanies([]);
        }
        finally{
            setFetchingCompanies(false);
        }
    };

    const fetchIndustries = async() => {
        try {
            setFetchingIndustries(true);
            const response= await fetch(industry_Url);
            const data = await response.json();
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch industries");
                }
                setIndustries(Array.isArray(data.industries)?data.industries:[]);
        }
        catch(error){
            console.error("Fetch industries error: ", error);
            setError(error.message || "Failed to fetch industries");
            setIndustries([]);
        }
        finally{
            setFetchingIndustries(false);
        }
    }

    useEffect(() => {
        fetchCompanies();
        fetchIndustries();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Handle nested bankDetails fields
  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      bankDetails: {
        ...previousData.bankDetails,
        [name]: value,
      },
    }));
  };

    // Reset form
  const resetForm = () => {
    setFormData(companiesData);
    setEditingId(null);
    setError("");
    setSuccessMessage("");
  };

     const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const url = editingId
        ? `${company_Url}/${editingId}`
        : company_Url;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to save company");
      }
      setSuccessMessage(
        editingId
          ? "Company updated successfully"
          : "Company created successfully"
      );
      resetForm();
      await fetchCompanies();
    } catch (error) {
      console.error("Save Company Error:", error);
      setError(error.message || "Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  // Fill form with selected company data
  const handleEdit = (company) => {
    setEditingId(company._id);
    setFormData({
      companyName: company.companyName || "",
      registrationNumber: company.registrationNumber || "",
      gstNumber: company.gstNumber || "",
      panNumber: company.panNumber || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      city: company.city || "",
      state: company.state || "",
      country: company.country || "",
      industryType: company.industryType?._id
        ? company.industryType._id
        : company.industryType || "",
      bankDetails: {
        bankName: company.bankDetails?.bankName || "",
        accountNumber: company.bankDetails?.accountNumber || "",
        ifscCode: company.bankDetails?.ifscCode || "",
      },
    });
    setError("");
    setSuccessMessage("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

   // Delete company
  const handleDelete = async (companyId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );
    if (!shouldDelete) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      const response = await fetch(
        `${company_Url}/${companyId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete company");
      }

      setSuccessMessage("Company deleted successfully");

      if (editingId === companyId) {
        resetForm();
      }

      await fetchCompanies();
    } catch (error) {
      console.error("Delete Company Error:", error);
      setError(error.message || "Failed to delete company");
    }
  };

  const getIndustryName = (company) => {
  // Case 1: Backend populated industryType
  if (company.industryType?.[0]?.name) {
    return company.industryType[0].name;
  }
  const industryId = company.industryType?.[0]?._id;
  // Case 2: Backend returned only the industry ID
  const industry = industries.find(
    (item) => String(item._id) === String(industryId)
  );
  return industry?.name || "Unknown Industry";
};
    


    return(
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Companies
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Create and manage company information and bank details.
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
                )}

                {successMessage && (
                     <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
                )}

                {/* Companies List */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-800"> 
                            All Companies
                        </h2>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue">
                            {companies.length} Companies
                        </span>
                    </div>

                    {fetchingCompanies ? (
                        <p className="text-sm text-slate-500">
                            Loading Companies ...
                        </p>
                    ): companies.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No companies found.Create your first company.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {companies.map((company) => (
                                <div key = {company._id}
                                className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h3>
                                                {company.companyName}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Registration No: {" "}
                                                {company.registrationNumber || "N/A"}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            Company
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <p>
                                            <span className="font-medium text-slate-800">
                                                Industry Type: 
                                            </span> {" "}
                                             {getIndustryName(company)}
                                        </p>

                                        <p>
                      <span className="font-medium text-slate-800">
                        GST:
                      </span>{" "}
                      {company.gstNumber || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        PAN:
                      </span>{" "}
                      {company.panNumber || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Email:
                      </span>{" "}
                      {company.email || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Phone:
                      </span>{" "}
                      {company.phone || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Address:
                      </span>{" "}
                      {company.address || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Location:
                      </span>{" "}
                      {[company.city, company.state, company.country]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Bank:
                      </span>{" "}
                      {company.bankDetails?.bankName || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        Account Number:
                      </span>{" "}
                      {company.bankDetails?.accountNumber || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-800">
                        IFSC:
                      </span>{" "}
                      {company.bankDetails?.ifscCode || "N/A"}
                    </p>
                                    </div>

                                     <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(company)}
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                     <button
                      type="button"
                      onClick={() => handleDelete(company._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    </div>
                                </div>
                            ))}
                        </div>
                    ) }
                </div>

                {/* Company Form */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-800">
              {editingId ? "Edit Company" : "Add New Company"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel Edit
              </button>
            )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Company Name and Registration Number */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 2: Industry Type Only */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Industry Type
              </label>

              <select
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                required
                disabled={fetchingIndustries}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  {fetchingIndustries
                    ? "Loading industries..."
                    : "Select Industry"}
                </option>

                {industries.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: GST Number and PAN Number */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  GST Number
                </label>

                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  PAN Number
                </label>

                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="Enter PAN number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 4: Email and Phone */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter company email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 5: Address Full Width */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                rows="3"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Row 6: City and State */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 7: Country and Bank Name */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bank Name
                </label>

                <input
                  type="text"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankDetailsChange}
                  placeholder="Enter bank name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Row 8: Account Number and IFSC Code */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account Number
                </label>

                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  placeholder="Enter account number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  IFSC Code
                </label>

                <input
                  type="text"
                  name="ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleBankDetailsChange}
                  placeholder="Enter IFSC code"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Company"
                  : "Create Company"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
              >
                Clear
              </button>
            </div>
          </form>
                </div>


            </div>
            </div>
    )
}