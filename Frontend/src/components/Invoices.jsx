import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Download,
  Eye,
  Search,
  FileText,
} from "lucide-react";

export const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Fetch all invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:3006/api/invoice"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch invoices"
          );
        }

        setInvoices(data.invoices || data.data || []);
      } catch (error) {
        console.error("Fetch Invoices Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Open individual invoice preview
  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  // Download will be connected to backend later
  const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
        setDownloading(true);
        setError("");

        const response = await fetch(
            `http://localhost:3006/api/invoice/${invoiceId}/download`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to download invoice"
            );
        }

        if (!data.pdfUrl) {
            throw new Error(
                "PDF URL was not returned"
            );
        }

        const link = document.createElement("a");

        link.href = data.pdfUrl;

        link.download = `${invoiceNumber}.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    } catch (error) {
        console.error(
            "Download Invoice Error:",
            error
        );

        setError(error.message);
    } finally {
        setDownloading(false);
    }
};

  // Search invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceNumber =
      invoice.invoiceNumber?.toLowerCase() || "";

    const companyName =
      invoice.company?.companyName?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    return (
      invoiceNumber.includes(searchValue) ||
      companyName.includes(searchValue)
    );
  });

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Invoice Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage invoices generated from bank statement transactions.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 h-4 w-4 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by invoice number or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Invoice List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Invoices
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  All invoices generated from statement transactions.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />

              <p className="text-sm font-medium text-slate-700">
                No invoices available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Generated invoices will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                >

                  {/* Invoice Information */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          invoice.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {invoice.status || "GENERATED"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {invoice.company?.companyName ||
                        "Company not available"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        Invoice Date:{" "}
                        {formatDate(invoice.createdAt)}
                      </span>

                      <span>
                        Period:{" "}
                        {formatDate(invoice.periodStart)}
                        {" - "}
                        {formatDate(invoice.periodEnd)}
                      </span>

                      <span>
                        Transactions:{" "}
                        {invoice.totalTransactions || 0}
                      </span>
                    </div>
                  </div>

                  {/* Amount + Actions */}
                  <div className="flex items-center gap-4">

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Total Amount
                      </p>

                      <p className="text-lg font-bold text-slate-900">
                        ₹{formatAmount(invoice.totalAmount)}
                      </p>
                    </div>

                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() =>
                        handleViewInvoice(invoice._id)
                      }
                      className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      title="View invoice"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadInvoice(invoice._id, invoice.invoiceNumber)
                      }
                      className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                      title="Download invoice"
                    >
                      <Download className="h-4 w-4" />
                      {downloading?"Downloading": "Download"}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}