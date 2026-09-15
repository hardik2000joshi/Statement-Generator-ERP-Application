import {BrowserRouter, Routes, Route} from "react-router-dom";
import { VendorCategories } from "./components/vendorCategories";
import { Vendors } from "./components/vendors";
import { Dashboard } from "./components/Dashboard";
import { Generator } from "./components/Generator";
import { Company } from "./components/Companies";
import { Industries } from "./components/Industries";
import {Invoices} from "./components/Invoices";
import { Templates } from "./components/Templates";
import { Settings } from "./components/Settings";
import {Layout} from "./layout";
export const Routing = () => {
    return(
        <BrowserRouter>
        <Routes>
            <Route
            element={<Layout/>}>
            <Route 
            path = "/"
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