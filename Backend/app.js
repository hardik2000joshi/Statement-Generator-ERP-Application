const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(express.json());
const companyRouter = require("./routes/companyRoutes");
const industryRouter = require("./routes/industryRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const vendorRouter = require("./routes/vendorRoutes");

app.use("/api/companies", companyRouter);
app.use("/api/industries", industryRouter);
app.use("/api/category", categoryRouter);
app.use("/api/vendors", vendorRouter);
app.get("/", (req, res) => {
    return res.send("Welcome to Statement Generator Application Backend");
})
module.exports = app;