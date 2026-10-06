import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BankStatement = () => {
  const navigate = useNavigate();
    const { statementId } = useParams();
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleTransactionSelection = (transactionId) => {
    setSelectedTransactions((previous) => {
      if (previous.includes(transactionId)) {
        return previous.filter((id) => id !== transactionId);
      }
      return [...previous, transactionId];
    });
  };

  const handleSelectAll = () => {
    if (!statement?.transactions?.length) {
      return;
    }

    if (
      selectedTransactions.length ===
      statement.transactions.length
    ) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(
        statement.transactions.map(
          (transaction) => transaction._id
        )
      );
    }
  };

   // Generate invoice from selected transactions
  const handleGenerateInvoice = async () => {
    setError("");

    if (selectedTransactions.length === 0) {
      setError("Please select at least one transaction.");
      return;
    }

    setInvoiceLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3006/api/invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bankStatementId: statement._id,
            transactionId: selectedTransactions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to generate invoice"
        );
      }

      // Invoice successfully created
      navigate(`/invoice/${data.invoice._id}`);
    } catch (error) {
      console.error(
        "Generate Invoice Error:",
        error
      );

      setError(
        error.message || "Failed to generate invoice"
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleGenerateFullInvoice = async () => {
    setError("");
    setInvoiceLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3006/api/invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bankStatementId: statement._id,
            allTransactions: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to generate invoice"
        );
      }
      navigate(`/invoice/${data.invoice._id}`);
    } catch (error) {
      console.error(
        "Generate Full Invoice Error:",
        error
      );
      setError(
        error.message ||
          "Failed to generate invoice"
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankStatement = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `http://localhost:3006/api/generator/${statementId}`,
        );
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch bank statement");
        }
        setStatement(data.data);
      } catch (error) {
        console.error("Fetch Bank Statement Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (statementId) {
      fetchBankStatement();
    }
  }, [statementId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading bank statement... </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Bank statement not found.</p>
      </div>
    );
  }

  const company = statement.company;
  const transactions = statement.transactions || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Bank Statement</h1>
          <p className="mt-1 text-sm text-slate-500">
            Generated bank statement and transaction details
          </p>
        </div>
        {/* Company Information */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Company Information
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Company Name
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {company?.companyName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Registration Number
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.registrationNumber || "N/A"}{" "}
              </p>
            </div>
            <div>
              
              <p className="text-xs font-medium uppercase text-slate-500">
                
                GST Number
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.gstNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                PAN Number
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.panNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Email
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Phone
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.phone || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase text-slate-500">
                Address
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.address || "N/A"}
              </p>
            </div>
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                {" "}
                City{" "}
              </p>{" "}
              <p className="mt-1 text-sm text-slate-900">
                {" "}
                {company?.city || "N/A"}{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                {" "}
                State{" "}
              </p>{" "}
              <p className="mt-1 text-sm text-slate-900">
                {" "}
                {company?.state || "N/A"}{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                Country
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {company?.country || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Bank Information
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Bank Name
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {company?.bankDetails?.bankName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Account Number
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {statement.accountNumber || "N/A"}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                {" "}
                IFSC Code{" "}
              </p>{" "}
              <p className="mt-1 text-sm text-slate-900">
                {" "}
                {company?.bankDetails?.ifscCode || "N/A"}{" "}
              </p>
            </div>
          </div>
        </div>
        {/* Statement Summary */}{" "}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {" "}
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            {" "}
            Statement Details{" "}
          </h2>{" "}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
            {" "}
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                {" "}
                Statement Type{" "}
              </p>{" "}
              <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
                {" "}
                {statement.statementType || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Period Start
              </p>

              <p className="mt-1 text-sm text-slate-900">
                {statement.periodStart
                  ? new Date(statement.periodStart).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Period End
              </p>
              <p className="mt-1 text-sm text-slate-900">
                {statement.periodEnd
                  ? new Date(statement.periodEnd).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Opening Balance
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                ₹
                {Number(statement.openingBalance || 0).toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
            <div>
              {" "}
              <p className="text-xs font-medium uppercase text-slate-500">
                {" "}
                Closing Balance{" "}
              </p>{" "}
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {" "}
                ₹
                {Number(statement.closingBalance || 0).toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Actions */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="font-semibold text-slate-900">
                Invoice Generation
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {selectedTransactions.length} transaction
                {selectedTransactions.length !== 1
                  ? "s"
                  : ""}{" "}
                selected
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={handleGenerateInvoice}
                disabled={
                  invoiceLoading ||
                  selectedTransactions.length === 0
                }
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {invoiceLoading
                  ? "Generating..."
                  : "Generate Invoice from Selected"}
              </button>

              <button
                type="button"
                onClick={handleGenerateFullInvoice}
                disabled={
                  invoiceLoading ||
                  !statement?.transactions?.length
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Invoice for All
              </button>
            </div>
          </div>
          </div>

        {/* Transactions */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select transactions to include in an invoice.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  {/* Select All */}
                  <th className="px-4 py-3">
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>{" "}
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {" "}
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <input 
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction._id)}
                        onChange={() => handleTransactionSelection(transaction._id)} 
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {transaction.date
                          ? new Date(transaction.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {transaction.description || "N/A"}{" "}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {transaction.type || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                        ₹
                        {Number(transaction.amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        ₹{Number(transaction.balance || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
