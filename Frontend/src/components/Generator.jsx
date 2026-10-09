import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Generator = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [recentStatements, setRecentStatements] = useState([]);
    const [fromDate, setFromDate] = useState(""); 
    const [toDate, setToDate] = useState("");
    const [txnsPerWeek, setTxnsPerWeek] = useState(5); 
    const [statementStyle, setStatementStyle] = useState("basic");
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch Companies:
    useEffect(() => {
        const fetchCompanies = async() => {
            try {
                const response = await fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/companies`);
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch companies");
                }
                setCompanies(data.companies || []);
            }
            catch(error){
                console.error("Fetch companies error: ", error);
                setError(error.message);
            }
        };
        fetchCompanies();
    }, []);

    // Fetch Statement generation history
    const fetchRecentStatements = useCallback(async () => {
        try { 
            setHistoryLoading(true); 
            /* This endpoint should return recently generated bank statements. Example: GET /api/generator */ 
            const response = await fetch( `${import.meta.env.VITE_LOCALHOST_URL}/api/generator` ); 
            const data = await response.json(); 
            if (!response.ok || !data.success) 
                { 
                    throw new Error( data.message || "Failed to fetch statement history" ); 
                } 
                const statements = data.data || [];
                setRecentStatements(data.data || []);
                // Latest generated statement
        if (statements.length > 0) {
            const latest = statements[0];
            setSummary({
                count: latest.totalTransactions,
                openingBalance: latest.openingBalance,
                closingBalance: latest.closingBalance,
                netChange:
                    latest.closingBalance -
                    latest.openingBalance,
                period: `${new Date(
                    latest.periodStart
                ).toLocaleDateString()} - ${new Date(
                    latest.periodEnd
                ).toLocaleDateString()}`,
            });
        } else {
            setSummary(null);
        }   
            } 
            catch (error) 
            { 
                console.error( "Fetch Recent Statements Error:", error );
             } 
             finally { 
                setHistoryLoading(false);
             } 
            }, []);
             useEffect(() => { 
                fetchRecentStatements(); 
            }, [fetchRecentStatements]);

    const handleGenerateStatement = async () => { 
        setError(""); 
        if (!companyId) { 
            setError("Please select a company");
             return; 
            } 
            if (!fromDate || !toDate) {
                 setError("Please select statement period");
                  return; 
                } 
                if (new Date(fromDate) > new Date(toDate)) { 
                    setError("From date cannot be greater than to date"); 
                    return; 
                } 
                if (!Number.isInteger(Number(txnsPerWeek)) || Number(txnsPerWeek) <= 0) { 
                    setError("Transactions per week must be greater than zero"); 
                    return; 
                } 
                setLoading(true); 
                try { 
                    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/generator`, {
                         method: "POST", 
                         headers: { 
                            "Content-Type": "application/json", 
                        },
                          body: JSON.stringify({ 
                            companyId, 
                            fromDate, 
                            toDate, 
                            rules: { 
                                txnsPerWeek: Number(txnsPerWeek),
                                 style: statementStyle, 
                                }, 
                            }), 
                        } 
                    ); 
                    const data = await response.json();
                     if (!response.ok || !data.success) { 
                        throw new Error( data.message || "Failed to generate bank statement" ); 
                    } 
                    /* Our backend returns the generated statement ID. Example: data.statementId */ 
                    const statementId = data.data?.statementId; 
                    if (!statementId) { 
                        throw new Error("Statement ID was not returned"); 
                    }

                    // update summary immediately
                    const openingBalance = Number(data.data?.openingBalance || 0);
                    const closingBalance = Number(data.data?.closingBalance || 0);
                    const totalTransactions = Number(data.data?.totalTransactions || 0);
                    setSummary({
                        count: totalTransactions,
                        openingBalance,
                        closingBalance,
                        netChange: closingBalance - openingBalance,
                        period: `${fromDate} to ${toDate}`,
                    });

                    // Refresh history
                    await fetchRecentStatements();

                    // Redirect to the new bank statement page 
                    navigate(`/generator/${statementId}`);
} 
catch (error) { 
    console.error("Generate Statement Error:", error); 
    setError(error.message); 
} 
finally { 
    setLoading(false); 
} 
};

// view generated statement
const handleViewStatement = (statementId) => {
    navigate(`/generator/${statementId}`);
};

// Download generated statement
const handleDownloadStatement = async(statementId) => {
    try {
        setLoading(true);
        setError("");
        const response = await fetch(`${import.meta.env.VITE_LOCALHOST_URL}/api/generator/${statementId}/download`);
        if(!response.ok){
            throw new error("Failed to download bank statement");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `statement-${statementId}.pdf`; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
        window.URL.revokeObjectURL(url);
       }
    catch(error){
        console.error( "Download Statement Error:", error );
        setError(error.message);
    }
    finally { 
        setLoading(false);
    }
};
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Bank Statement Generator
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Generate a realistic bank statement from company and vendor transactions.
                        </p>
                </div>

                {/* Generator Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Company */}
                        <div className="md: col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Company
                            </label>
                            <select
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"                        
                            >
                                <option value="">
                                    Select Company
                                </option>

                                {companies.map((company) => (
                                    <option
                                    key={company._id} 
                                    value={company._id}
                                    >
                                        {company.companyName}
                                    </option>
                                ))}
                                </select>
                        </div>

                        {/* From Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700"> 
                                From Date
                                </label>
                                <input 
                                type="date" 
                                value={fromDate} 
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500" 
                                />
                        </div>

                        {/* To Date */} 
                        <div> 
                            <label className="mb-2 block text-sm font-medium text-slate-700"> 
                                To Date 
                                </label> 
                                <input 
                                type="date" 
                                value={toDate} 
                                onChange={(e) => setToDate(e.target.value)} 
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500" 
                                /> 
                                </div>

                                {/* Transactions Per Week */} 
                                <div> 
                                    <label className="mb-2 block text-sm font-medium text-slate-700"> 
                                        Transactions Per Week 
                                        </label> 
                                        <input 
                                        type="number" 
                                        min="1" 
                                        value={txnsPerWeek} 
                                        onChange={(e) => setTxnsPerWeek(e.target.value)} 
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500" 
                                        /> 
                                        </div>

                                        {/* Statement Style */} 
                                        <div> 
                                            <label className="mb-2 block text-sm font-medium text-slate-700"> 
                                                Statement Style 
                                                </label> 
                                                <select 
                                                value={statementStyle} 
                                                onChange={(e) => setStatementStyle(e.target.value)} 
                                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500" 
                                                > 
                                                <option value="basic"> 
                                                    Basic 
                                                    </option> 
                                                    <option value="detailed"> 
                                                        Detailed 
                                                        </option> 
                                                        <option value="minimal"> 
                                                            Minimal 
                                                            </option> 
                                                            </select> 
                                                            </div>
                    </div>

                    {/* Error */} 
                    {error && ( 
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                             {error} 
                             </div> 
                            )}

                            {/* Generate Button */} 
                            <button 
                            type="button" 
                            onClick={handleGenerateStatement} 
                            disabled={loading} 
                            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"> 
                            {loading 
                            ? "Generating Bank Statement..." 
                            : "Generate Bank Statement"} 
                            </button>
                </div>

                {/* Statement Generation Summary*/}
                {summary && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Generation Summary
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Summary of the latest generated statement
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    Transactions
                                    </p>
                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {summary.count}
                                        </p>                            
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4"> 
                                    <p className="text-xs font-medium uppercase text-slate-500"> 
                                        Opening Balance 
                                        </p>

                                        <p className="mt-2 text-xl font-bold text-slate-900"> 
                                            {summary.openingBalance.toLocaleString( "en-IN" )} 
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4"> 
                                            <p className="text-xs font-medium uppercase text-slate-500"> 
                                                Closing Balance 
                                                </p> 
                                                
                                                <p className="mt-2 text-xl font-bold text-slate-900">  
                                                    {summary.closingBalance.toLocaleString( "en-IN" )} 
                                                    </p> 
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-4"> 
                                                        <p className="text-xs font-medium uppercase text-slate-500"> 
                                                            Net Change 
                                                            </p> 
                                                            
                                                            <p className="mt-2 text-xl font-bold text-slate-900"> 
                                                                {summary.netChange.toLocaleString( "en-IN" )} 
                                                                </p> 
                                                                </div>

                                                                <div className="rounded-xl bg-slate-50 p-4"> 
                                                                    <p className="text-xs font-medium uppercase text-slate-500"> 
                                                                        Period 
                                                                        </p> 
                                                                        
                                                                        <p className="mt-2 text-sm font-semibold text-slate-900"> 
                                                                            {summary.period} 
                                                                            </p> 
                                                                            </div>
                        </div>
                    </div>
                )}

                {/* Statement Generation History */}               
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6"> 
                        <h2 className="text-lg font-bold text-slate-900"> 
                            Statement Generation History 
                            </h2> 
                            <p className="mt-1 text-sm text-slate-500"> 
                                Recently generated bank statements. 
                                </p> 
                                </div>

                                {historyLoading ? (
                                    <div className="p-8 text-center text-sm text-slate-500"> 
                                    Loading statement history... 
                                    </div>
                                ): recentStatements.length === 0 ? (
                                    <div className="p-8 text-center text-sm text-slate-500">
                                         No bank statements generated yet. 
                                         </div>
                                ): (
                                    <div className="overflow-x-auto"> 
                                    <table className="min-w-full"> 
                                        <thead className="bg-slate-50"> 
                                            <tr> 
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                    Company 
                                                    </th> 
                                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                        Period 
                                                        </th> 
                                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                            Transactions 
                                                            </th> 
                                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                                Opening Balance 
                                                                </th> 
                                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                                    Closing Balance 
                                                                    </th> 
                                                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"> 
                                                                        Actions 
                                                                        </th> 
                                                                        </tr> 
                                                                        </thead> 
                                                                        <tbody className="divide-y divide-slate-100"> 
                                                                            {recentStatements.map((statement) => (
                                                                                 <tr key={statement._id} 
                                                                                 className="hover:bg-slate-50" 
                                                                                 > 
                                                                                 {/* Company */} 
                                                                                 <td className="px-6 py-4"> 
                                                                                    <p className="text-sm font-semibold text-slate-900"> 
                                                                                        {statement.company?.companyName || statement.companyName || "N/A"} 
                                                                                        </p> 
                                                                                        </td> 
                                                                                        {/* Period */}

                                                                                        <td className="px-6 py-4 text-sm text-slate-700">
                                                                                            {statement.periodStart ? new Date( statement.periodStart ).toLocaleDateString() : "N/A"}
                                                                                            {" - "}
                                                                                            {statement.periodEnd ? new Date( statement.periodEnd ).toLocaleDateString() : "N/A"}
                                                                                        </td>

                                                                                        {/* Transactions */} 
                                                                                        
                                                                                        <td className="px-6 py-4 text-right text-sm text-slate-700"> 
                                                                                            {statement.totalTransactions ?? 0} 
                                                                                            </td>

                                                                                            {/*  Opening Balnce */}
                                                                                            <td className="px-6 py-4 text-right text-sm text-slate-700">
                                                                                                 ₹ {Number( statement.openingBalance || 0 ).toLocaleString("en-IN")} 
                                                                                                 </td>

                                                                                                 {/* Closing Balance */} 
                                                                                                 <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                                                                                                     ₹ {Number( statement.closingBalance || 0 ).toLocaleString("en-IN")} 
                                                                                                     </td>

                                                                                                     {/* Actions */}

                                                                                                     <td className="px-6 py-4">
                                                                                                        <div className="flex justify-end gap-2">
                                                                                                            <button 
                                                                                                            type="button" 
                                                                                                            onClick={() => handleViewStatement(statement._id)}
                                                                                                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" > 
                                                                                                            View 
                                                                                                            </button>

                                                                                                            <button 
                                                                                                            type="button" 
                                                                                                            onClick={() => handleDownloadStatement( statement._id ) } 
                                                                                                            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" 
                                                                                                            > 
                                                                                                            Download 
                                                                                                            </button>
                                                                                                        </div>
                                                                                                     </td>
                                                                                        </tr>
                                                                            ))}
                                                                            </tbody>
                                                                            </table>
                                                                            </div>
                                )}
                    </div>                                                                                                                                                                                                  
                
            </div>
            
        </div>
    );
}