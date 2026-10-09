import { RefreshCw, Building2, Factory, Users, FileText, Receipt, IndianRupee, CheckCircle2, Clock3, AlertCircle, TrendingUp, Activity} from "lucide-react";
import { useState, useEffect, useMemo} from "react";

const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const FinancialCard = ({
  title,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            ₹
            {Number(amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>

      </div>

    </div>
  );
};

// Statistic Bar
const StatisticBar = ({
  label,
  value,
  total,
  className,
}) => {
  const percentage = total > 0 ? Math.round((value/total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${className}`}
        style={{
          width: `${percentage}%`,
        }}
        />
      </div>

      <p className="mt-1 text-right text-xs text-slate-400">
        {percentage} %
      </p>
    </div>
  );
};

// Mini Statistic
const MiniStatistic = ({label, value}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  )
}


export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statements, setStatements] = useState([]);
  const [invoices, setInvoices] = useState([]);

   const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        companiesResponse,
        industriesResponse,
        vendorsResponse,
        invoicesResponse,
        statementsResponse,
      ] = await Promise.all([
        fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/companies`, {
          credentials: "include"
        }),
        fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/industries`),
        fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/vendors`),
        fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/invoice`),
        fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/generator`),
      ]);

      const [
        companiesData,
        industriesData,
        vendorsData,
        invoicesData,
        statementsData,
      ] = await Promise.all([
        companiesResponse.json(),
        industriesResponse.json(),
        vendorsResponse.json(),
        invoicesResponse.json(),
        statementsResponse.json(),
      ]);

      // Companies
      if (companiesResponse.ok) {
        setCompanies(
          companiesData.data ||
            companiesData.companies ||
            []
        );
      }

      // Industries
      if (industriesResponse.ok) {
        setIndustries(
          industriesData.data ||
            industriesData.industries ||
            []
        );
      }

      // Vendors
      if (vendorsResponse.ok) {
        setVendors(
          vendorsData.data ||
            vendorsData.vendors ||
            []
        );
      }

      // Invoices
      if (invoicesResponse.ok) {
        setInvoices(
          invoicesData.data ||
            invoicesData.invoices ||
            []
        );
      }

      // Bank statements
      if (statementsResponse.ok) {
        setStatements(
          statementsData.data ||
            statementsData.statements ||
            []
        );
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const invoiceAnalytics = useMemo(() => {
    const totalAmount = invoices.reduce(
      (total, invoice) =>
        total + Number(invoice.totalAmount || invoice.amount || 0),
      0
    );

    const paidAmount = invoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.totalAmount || invoice.amount || 0),
        0
      );

    const pendingAmount = invoices
      .filter(
        (invoice) =>
          invoice.status === "GENERATED" ||
          invoice.status === "DRAFT"
      )
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.totalAmount || invoice.amount || 0),
        0
      );

    const overdueAmount = invoices
      .filter((invoice) => invoice.status === "OVERDUE")
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.totalAmount || invoice.amount || 0),
        0
      );

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
    };
  }, [invoices]);

  const invoiceStatistics = useMemo(() => {
    return {
      generated: invoices.filter((invoice) => invoice.status === "GENERATED").length,
      paid: invoices.filter((invoice) => invoice.status === "PAID").length,
      pending: invoices.filter((invoice) => invoice.status === "DRAFT" || invoice.status === "GENERATED").length,
      overdue: invoices.filter((invoice) => invoice.status === "OVERDUE").length,
      cancelled: invoices.filter((invoice) => invoice.status === "CANCELLED").length,
    };
  }, [invoices]);

  // Statement Statistics
  const statementStatistics = useMemo(() => {
    const totalTransactions = statements.reduce((total, statement) => total + Number(statement.totalTransactions || statement.tarsnsactions?.length || 0), 0);
    const totalGenerated = statements.length;
    const basicStatements = statements.filter((statement) => statement.statementType === "basic").length;
    return {
      totalGenerated,
      totalTransactions,
      basicStatements,
    };                                                  
  }, [statements]);

  // Recent Transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [];

    statements.forEach((statement) => {
      if (!Array.isArray(statement.transactions)) {
        return;
      }

      statement.transactions.forEach((transaction) => {
        allTransactions.push({
          ...transaction,
          statementId: statement._id,
          statementDate: statement.createdAt,
        });
      });
    });

    return allTransactions
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt || 0) -
          new Date(a.date || a.createdAt || 0)
      )
      .slice(0, 6);
  }, [statements]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.created || 0) -
          new Date(a.createdAt || a.created || 0)
      )
      .slice(0, 5);
  }, [invoices]);

  const recentStatements = useMemo(() => {
    return [...statements]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [statements]);

  if(loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Dashboard...
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen w-full bg-slate-50">
         <header className="border-b border-slate-200 bg-white px-8 py-5 shadow-sm">
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your companies, vendors, statements and invoices
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

        </div>
      </header>

      <main className="space-y-8 p-8">

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Key Analytics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overall application statistics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {/* Companies */},
            <AnalyticsCard
              title="Total Companies"
              value={companies.length}
              icon={Building2}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            {/* Industries */}
             <AnalyticsCard
              title="Total Industries"
              value={industries.length}
              icon={Factory}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />

            {/* Vendors */}
            <AnalyticsCard
              title="Total Vendors"
              value={vendors.length}
              icon={Users}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />

            {/* Statements */}
            <AnalyticsCard
              title="Generated Statements"
              value={statements.length}
              icon={FileText}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
            />

            {/* Invoices */}
            <AnalyticsCard
              title="Total Invoices"
              value={invoices.length}
              icon={Receipt}
              iconBg="bg-cyan-100"
              iconColor="text-cyan-600"
            />

          </div>
        </section>

        {/* Financial Analytics */}
        <section>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Invoice Financial Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial summary of generated invoices
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Total */}
            <FinancialCard
              title="Total Invoice Amount"
              amount={invoiceAnalytics.totalAmount}
              icon={IndianRupee}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            {/* Paid */}
            <FinancialCard
              title="Paid Amount"
              amount={invoiceAnalytics.paidAmount}
              icon={CheckCircle2}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />

            {/* Pending */}
            <FinancialCard
              title="Pending Amount"
              amount={invoiceAnalytics.pendingAmount}
              icon={Clock3}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />

            {/* Overdue */}
            <FinancialCard
              title="Overdue Amount"
              amount={invoiceAnalytics.overdueAmount}
              icon={AlertCircle}
              iconBg="bg-red-100"
              iconColor="text-red-600"
            />

          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Invoice Statistics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Invoice Statistics
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invoice status breakdown
                </p>
              </div>

              <div className="rounded-xl bg-cyan-100 p-3">
                <Receipt className="h-5 w-5 text-cyan-600" />
              </div>
            </div>

            <div className="space-y-5">
              <StatisticBar
              label="GENERATED"
              value={invoiceStatistics.generated}
              total={invoices.length}
              className="bg-blue-500"
               />

               <StatisticBar
               label="Paid"
               value={invoiceStatistics.paid}
               total={invoices.length}
               className="bg-emerald-500"
               />

               <StatisticBar
               label="Pending"
               value={invoiceStatistics.pending}
               total={invoices.length}
               className="bg-amber-500"
               />

               <StatisticBar
               label="Overdue" 
               value={invoiceStatistics.overdue}
               total={invoices.length}
               className="bg-red-500"
               />

               <StatisticBar
               label="Cancelled"
               value={invoiceStatistics.cancelled}
               total={invoices.length}
               className="bg-slate-400"
               />

            </div>
          </div>

          {/* Statement Statistics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Statement Generation Statistics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Bank statement generation overview
                </p>
              </div>

              <div className="rounded-xl bg-orange-100 p-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <MiniStatistic
                label="Generated"
                value={statementStatistics.totalGenerated}
              />

              <MiniStatistic
                label="Transactions"
                value={statementStatistics.totalTransactions}
              />

              <MiniStatistic
                label="Basic Statements"
                value={statementStatistics.basicStatements}
              />

            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Average Transactions
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {statementStatistics.totalGenerated > 0
                      ? Math.round(
                          statementStatistics.totalTransactions /
                            statementStatistics.totalGenerated
                        )
                      : 0}
                  </p>
                </div>

                <Activity className="h-8 w-8 text-slate-400" />

              </div>

            </div>

          </div>
        </section>

        {/* Recent Transactions */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                 Recent Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest transactions from generated statements
              </p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
                    </div>

                     {recentTransactions.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No recent transactions available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Balance
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentTransactions.map((transaction) => (

                    <tr
                      key={transaction._id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 text-sm text-slate-600">
                         {transaction.date
                ? new Date(transaction.date).toLocaleDateString("en-IN")
                : "N/A"}
                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-900">
                          {transaction.description || "Transaction"}
                        </p>

                        {transaction.vendor?.name && (
                          <p className="mt-1 text-xs text-slate-500">
                            {transaction.vendor.name}
                          </p>
                        )}

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            transaction.type === "credit"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type}
                        </span>

                      </td>

                      <td
                        className={`px-6 py-4 text-right text-sm font-semibold ${
                          transaction.type === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit"
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">
                        {formatCurrency(transaction.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}
        </section>

        {/* Recent Invoices */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Invoices
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest generated invoices
                </p>
              </div>

              <Receipt className="h-5 w-5 text-slate-400" />
            </div>

            <div className="divide-y divide-slate-100">
              {recentInvoices.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-slate-500">
                  No invoices available.
                </p>
              ) : (
                recentInvoices.map((invoice) => (
                  <div
                    key={invoice._id}
                    className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {invoice.invoiceNumber ||
                          `INV-${invoice._id}`}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {invoice.company?.companyName ||
                          "Company"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(
                          invoice.totalAmount
                        )}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          invoice.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : invoice.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {invoice.status || "GENERATED"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Recently generated statements */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recently Generated Statements
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest bank statements
                </p>
              </div>

              <FileText className="h-5 w-5 text-slate-400" />

            </div>

            <div className="divide-y divide-slate-100">
              {recentStatements.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-slate-500">
                  No statements available.
                </p>
              ) : (
                recentStatements.map((statement) => (
                  <div
                    key={statement._id}
                    className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                  >

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        Bank Statement
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {statement.company?.companyName ||
                          "Company"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(statement.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="font-medium text-slate-700">
                        {statement.totalTransactions ||
                          statement.transactions?.length ||
                          0}{" "}
                        transactions
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {statement.statementType || "Basic"}
                      </p>
                    </div>
                  </div>

                ))

              )}

            </div>
          </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Business Data
                </p>
                <p className="font-semibold text-slate-900">
                  {companies.length} Companies ·{" "}
                  {vendors.length} Vendors
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-100 p-3">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  Generated Documents
                </p>
                <p className="font-semibold text-slate-900">
                  {statements.length} Statements ·{" "}
                  {invoices.length} Invoices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-100 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  Invoice Value
                </p>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(
                    invoiceAnalytics.totalAmount
                  )}
                </p>
              </div>
            </div>
          </div>

        </section>
        </main>
    </div>
  );
};
