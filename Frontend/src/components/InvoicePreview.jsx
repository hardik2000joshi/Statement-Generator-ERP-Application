import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const InvoicePreview = () => {
    const navigate = useNavigate();
    const {invoiceId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [invoice, setInvoice] = useState(null);
    useEffect(() => {
        const fetchInvoice = async() => {
            try {
                setLoading(true);
                setError("");
                if(!invoiceId){
                    throw new Error("Invoice Id is missing");
                }
                const response = await fetch(`http://localhost:3006/api/invoice/${invoiceId}`);
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch invoice");
                }
                setInvoice(data.invoice);
            }
            catch(error){
                console.error("Fetch Invoice Error: ", error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [invoiceId]);

    const invoiceDirection = useMemo(() => {
        if(!invoice?.transactions?.length){
            return null;
        }
        const hasDebit = invoice.transactions.some((transaction) => transaction.type === "debit"); // Determines whether the specified callback function returns true for any element of an array.
        const hasCredit = invoice.transactions.some((transaction) => transaction.type === "credit"); // Determines whether the specified callback function returns true for any element of an array.

        if(hasDebit && !hasCredit){
            return "expense";
        }

        if(hasCredit && !hasDebit){
            return "income";
        }

        return "mixed";
    }, [invoice]);

    // Issuer of the invoice
  const issuer = useMemo(() => {
    if (!invoice) return null;

    if (invoiceDirection === "expense") {
      return invoice.transactions?.[0]?.vendor;
    }

    return invoice.company;
  }, [invoice, invoiceDirection]);

  // Bill To - on whose name bill (invoice) is generated
  const billTo = useMemo(() => {
    if(!invoice){
        return null;
    }
    if(invoiceDirection === "expense"){
        return invoice.company;
    }
    return invoice.transactions?.[0]?.vendor;
  }, [invoice, invoiceDirection]);

  const formatDate = (date) => {
    if(!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
  };

  if(loading){
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading invoice...
          </p>
        </div>
        </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Failed to load invoice
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => navigate("/invoice")}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if(!invoice){
    return null;
  }


  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Invoice Preview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Preview generated invoice
            </p>
          </div>
          <button onClick={() => navigate("/invoice")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
                Back to Invoices
          </button>
        </div>

        {/* Invoice */}
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <div className="flex flex-col justify-between gap-8 border-b border-slate-200 pb-8 md:flex-row">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {issuer?.companyName || issuer?.name || "N/A"}
                    </h2>
                    {
                        issuer ?.address && (
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {issuer.address}
                            </p>
                        )
                    }
                    {issuer?.city &&(
                        <p className="text-sm text-slate-500">
                            {issuer.city}
                            {issuer.state ? `, ${issuer.state}` : ""}
                            {issuer.country ? `${issuer.country}`: ""}
                        </p>
                    )}

                    {issuer?.email &&(
                        <p className="mt-2 text-sm text-slate-600">
                            Email: {issuer.email}
                        </p>
                    )}

                    {issuer?.phone && (
                        <p className="text-sm text-slate-600">
                            Phone: {issuer.phone}
                        </p>
                    )}
                </div>

                {/* Invoice Information */}
            <div className="text-left md:text-right">
              <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                Invoice
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                #{invoice.invoiceNumber}
              </p>

              <div className="mt-4 space-y-1 text-sm text-slate-500">
                <p>
                  Date:{" "}
                  <span className="font-medium text-slate-700">
                    {formatDate(invoice.createdAt)}
                  </span>
                </p>

                <p>
                  Period:{" "}
                  <span className="font-medium text-slate-700">
                    {formatDate(invoice.periodStart)}
                    {" - "}
                    {formatDate(invoice.periodEnd)}
                  </span>
                </p>
              </div>
            </div>
            </div>

             {/* Invoice Direction */}
          <div className="mt-8">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                invoiceDirection === "income"
                  ? "bg-green-100 text-green-700"
                  : invoiceDirection === "expense"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {invoiceDirection === "income"
                ? "Income Invoice"
                : invoiceDirection === "expense"
                  ? "Expense Invoice"
                  : "Mixed Transactions"}
            </span>
          </div>

          {/* BILL TO */}
          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bill To
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {billTo?.companyName || billTo?.name || "N/A"}
            </p>

            {billTo?.address && (
              <p className="mt-1 text-sm text-slate-500">
                {billTo.address}
              </p>
            )}

            {billTo?.city && (
              <p className="text-sm text-slate-500">
                {billTo.city}
                {billTo.state ? `, ${billTo.state}` : ""}
                {billTo.country ? `, ${billTo.country}` : ""}
              </p>
            )}

            {billTo?.email && (
              <p className="mt-2 text-sm text-slate-600">
                Email: {billTo.email}
              </p>
            )}
          </div>

          {/* Transactions */}
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rate (INR)
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total (INR)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {invoice.transactions?.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {transaction.description || "Transaction"}
                      </p>

                      {transaction.vendor?.name && (
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.vendor.name}
                        </p>
                      )}

                      {transaction.category?.name && (
                        <p className="text-xs text-slate-400">
                          {transaction.category.name}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center text-sm text-slate-700">
                      1
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-slate-700">
                      ₹{formatAmount(transaction.amount)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                      ₹{formatAmount(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-3">

              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>

                <span>
                  ₹{formatAmount(invoice.totalAmount)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-slate-900">
                    Total Amount Due
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    ₹{formatAmount(invoice.totalAmount)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Payment Details */}
          {invoice.company?.bankDetails && (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Payment Details
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">

                <div>
                  <p className="text-slate-500">
                    Bank Name
                  </p>

                  <p className="font-medium text-slate-900">
                    {invoice.company.bankDetails.bankName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Account Number
                  </p>

                  <p className="font-medium text-slate-900">
                    {invoice.company.bankDetails.accountNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    IFSC Code
                  </p>

                  <p className="font-medium text-slate-900">
                    {invoice.company.bankDetails.ifscCode || "N/A"}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
