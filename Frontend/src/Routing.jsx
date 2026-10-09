import {BrowserRouter, Routes, Route} from "react-router-dom";
import { VendorCategories } from "./components/VendorCategories";
import { Vendors } from "./components/Vendors";
import { Dashboard } from "./components/Dashboard";
import { Generator } from "./components/Generator";
import { Company } from "./components/Companies";
import { Industries } from "./components/Industries";
import {Invoices} from "./components/Invoices";
import { Templates } from "./components/Templates";
import { Settings } from "./components/Settings";
import {Layout} from "./layout";
import { BankStatement } from "./components/BankStatement";
import { InvoicePreview } from "./components/InvoicePreview";
import {SignupPage} from "./components/signupPage";
import { LoginPage } from "./components/LoginPage";
import { AdminLoginPage } from "./components/AdminLogin";
export const Routing = () => {
    return(
        <BrowserRouter>
        <Routes>

                <Route
                path="/"
                element={<SignupPage/>}
                />
                <Route 
                path="/login"
                element={<LoginPage />}
                />
                <Route
                path="/admin/login"
                element={<AdminLoginPage/>}
                 />
                <Route
            element={<Layout/>}>
            <Route 
            path = "/dashboard"
            element={< Dashboard/>}
            />
            <Route 
            path="/company"
            element={<Company />}
            />
            <Route
            path="/industries"
            element={<Industries />}
             />
            <Route 
            path="/generator"
            element={<Generator />}
            />
            <Route
            path="/generator/:statementId"
            element={<BankStatement />}
            />
            <Route 
            path = "/vendor-categories"
            element={<VendorCategories />}
            />
            <Route 
            path = "/vendors"
            element = {<Vendors/>}
            />
            <Route
            path = "/invoice"
            element={<Invoices />}
            />
            <Route
            path="/invoice/:invoiceId"
            element={<InvoicePreview />}
            />
            <Route
            path="/template"
            element={<Templates />}
            />
            <Route
            path="/setting"
            element={<Settings />}
                />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}