import {BrowserRouter, Routes, Route} from "react-router-dom";
import { VendorCategories } from "./components/vendorCategories";
import { Vendors } from "./components/vendors";
import { Dashboard } from "./components/Dashboard";
export const Routing = () => {
    return(
        <BrowserRouter>
        <Routes>
            <Route 
            path = "/"
            element={< Dashboard/>}
            />
            <Route 
            path = "/vendor-categories"
            element={<VendorCategories />}
            />
            <Route 
            path = "/vendors"
            element = {<Vendors/>}
            />
            </Routes>
        </BrowserRouter>
    )
}