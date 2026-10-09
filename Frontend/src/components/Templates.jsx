import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_LOCALHOST_URL}/api/templates`;

const previewVariables = {
  companyName: "Company Name",
  periodStart: "23/09/2026",
  periodEnd: "30/09/2026",
  totalTransactions: "5",
  totalAmount: "27,276",
  openingBalance: "5,000",
  closingBalance: "23,276",
  senderName: "Statement Generator",
};

const defaultTemplates = {
  BASIC: {
    name: "Basic Bank Statement",
    subject: "Your Bank Statement",
    body: `<h2>Your Monthly Bank Statement</h2>
<p>Hello {{companyName}},</p>
<p>Your bank statement has been generated for transactions from <strong>{{periodStart}}</strong> to <strong>{{periodEnd}}</strong>.</p>
<p>Please find your bank statement attached.</p>
<p>Regards,<br>{{senderName}}</p>`,
  },

  DETAILED: {
    name: "Detailed Bank Statement",
    subject: "Your Detailed Bank Statement",
    body: `<h2>Your Monthly Bank Statement</h2>
<p>Hello {{companyName}},</p>
<p>Your bank statement has been generated for transactions from <strong>{{periodStart}}</strong> to <strong>{{periodEnd}}</strong>.</p>

<h3>Statement Summary</h3>

<p>Total Transactions: <strong>{{totalTransactions}}</strong></p>
<p>Total Amount: ₹<strong>{{totalAmount}}</strong></p>
<p>Opening Balance: ₹<strong>{{openingBalance}}</strong></p>
<p>Closing Balance: ₹<strong>{{closingBalance}}</strong></p>

<p>Please find your bank statement attached.</p>
<p>Regards,<br>{{senderName}}</p>`,
  },

  MINIMAL: {
    name: "Minimal Bank Statement",
    subject: "Your Bank Statement",
    body: `<h2>Your Monthly Bank Statement</h2>
<p>Hello {{companyName}},</p>
<p>Your bank statement has been generated for transactions.</p>
<p>Please find your bank statement attached.</p>
<p>Regards,<br>{{senderName}}</p>`,
  },
};

export function Templates() {
  const [templates, setTemplates] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "BASIC",
    subject: "",
    body: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  // -----------------------------------------
  // GET TEMPLATES
  // -----------------------------------------

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch templates"
        );
      }

      setTemplates(data.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // -----------------------------------------
  // HANDLE INPUT
  // -----------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // TEMPLATE TYPE CHANGE
  // -----------------------------------------

  const handleTypeChange = (event) => {
    const type = event.target.value;

    setFormData((previous) => ({
      ...previous,
      type,
    }));
  };

  // -----------------------------------------
  // INSERT VARIABLE
  // -----------------------------------------

  const insertVariable = (variable) => {
    const variableText = `{{${variable}}}`;

    setFormData((previous) => ({
      ...previous,
      body: `${previous.body}${variableText}`,
    }));
  };

  // -----------------------------------------
  // LOAD DEFAULT TEMPLATE
  // -----------------------------------------

  const loadDefaultTemplate = () => {
    const template = defaultTemplates[formData.type];

    if (!template) return;

    setFormData({
      name: template.name,
      type: formData.type,
      subject: template.subject,
      body: template.body,
    });
  };

  // -----------------------------------------
  // PREVIEW HTML
  // -----------------------------------------

  const renderPreview = (body) => {
    if (!body) return "";

    return body.replace(
      /{{\s*([^}]+)\s*}}/g,
      (match, variableName) => {
        const key = variableName.trim();

        return previewVariables[key] !== undefined
          ? previewVariables[key]
          : match;
      }
    );
  };

  // -----------------------------------------
  // CREATE / UPDATE
  // -----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (
        !formData.name.trim() ||
        !formData.type ||
        !formData.subject.trim() ||
        !formData.body.trim()
      ) {
        setError(
          "Name, type, subject and body are required"
        );

        return;
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

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
          data.message || "Failed to save template"
        );
      }

      setMessage(
        editingId
          ? "Template updated successfully"
          : "Template created successfully"
      );

      resetForm();

      fetchTemplates();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // EDIT
  // -----------------------------------------

  const handleEdit = (template) => {
    setEditingId(template._id);

    setFormData({
      name: template.name || "",
      type: template.type || "BASIC",
      subject: template.subject || "",
      body: template.body || "",
    });

    setShowPreview(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------------------
  // DELETE
  // -----------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this template?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete template"
        );
      }

      setMessage("Template deleted successfully");

      fetchTemplates();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // -----------------------------------------
  // RESET
  // -----------------------------------------

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      type: "BASIC",
      subject: "",
      body: "",
    });
  };

  return (
    <div className="min-h-screen p-6">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Email Templates
        </h1>

        <p className="mt-1 text-gray-500">
          Create and manage bank statement email templates.
        </p>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}

      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId
              ? "Edit Template"
              : "Create Template"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* NAME + TYPE */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Template Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Basic Bank Statement"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Template Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="BASIC">
                  BASIC
                </option>

                <option value="DETAILED">
                  DETAILED
                </option>

                <option value="MINIMAL">
                  MINIMAL
                </option>
              </select>
            </div>

          </div>

          {/* LOAD DEFAULT */}

          <button
            type="button"
            onClick={loadDefaultTemplate}
            className="mt-4 rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
          >
            Load {formData.type} Template
          </button>

          {/* SUBJECT */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Your Bank Statement"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* VARIABLES */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Insert Variable
            </label>

            <div className="flex flex-wrap gap-2">

              {Object.keys(previewVariables).map(
                (variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() =>
                      insertVariable(variable)
                    }
                    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {`{{${variable}}}`}
                  </button>
                )
              )}

            </div>

          </div>

          {/* HTML BODY */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Body
            </label>

            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={14}
              placeholder="<h2>Your Monthly Bank Statement</h2>
<p>Hello {{companyName}},</p>
<p>Your bank statement has been generated.</p>"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-500">
              Write the email HTML here. The HTML will be
              rendered as the actual email during preview and
              when the email is sent.
            </p>

          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Template"
                : "Create Template"}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowPreview(true)
              }
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Preview Email
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* EXISTING TEMPLATES */}

      <div className="mt-8">

        <h2 className="mb-4 text-xl font-semibold">
          Existing Templates
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading templates...
          </p>
        ) : templates.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            No templates found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {templates.map((template) => (

              <div
                key={template._id}
                className="rounded-xl bg-white p-5 shadow-sm"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {template.name}
                    </h3>

                    <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {template.type}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      template.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {template.status}
                  </span>

                </div>

                <div className="mt-4">

                  <p className="text-sm font-medium text-gray-500">
                    Subject
                  </p>

                  <p className="mt-1 text-gray-800">
                    {template.subject}
                  </p>

                </div>

                {/* ACTUAL EMAIL PREVIEW */}

                <div className="mt-4">

                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Preview
                  </p>

                  <div className="max-h-[250px] overflow-auto rounded-lg border p-5"
                  style={{ backgroundColor: "var(--app-background)" }}
>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderPreview(
                          template.body
                        ),
                      }}
                    />

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(template)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(template._id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* PREVIEW MODAL */}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-gray-100">

            <div className="flex items-center justify-between border-b bg-white p-5">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Email Preview
                </h2>

                <p className="text-sm text-gray-500">
                  Preview of the actual email.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPreview(false)
                }
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Close
              </button>

            </div>

            {/* EMAIL */}

            <div className="p-8">

              <div className="mx-auto max-w-2xl rounded-lg bg-white shadow">

                {/* EMAIL HEADER */}

                <div className="border-b px-6 py-5">

                  <p className="text-xs text-gray-500">
                    Subject
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formData.subject ||
                      "Your Bank Statement"}
                  </p>

                </div>

                {/* RENDERED EMAIL */}

                <div className="px-8 py-8">

                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderPreview(
                        formData.body
                      ),
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

