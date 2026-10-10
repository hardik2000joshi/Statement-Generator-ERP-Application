const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoutes");
const companyRouter = require("./routes/companyRoutes");
const industryRouter = require("./routes/industryRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const vendorRouter = require("./routes/vendorRoutes");
const generateRouter  = require("./routes/generatorRoutes");
const invoiceRouter = require("./routes/invoiceRoutes");
const emailRouter = require("./routes/emailRoutes");
const templateRouter = require("./routes/templateRoutes");

app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/industries", industryRouter);
app.use("/api/category", categoryRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/generator", generateRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/email", emailRouter);
app.use("/api/templates", templateRouter);
app.get("/", (req, res) => {
    return res.send("Welcome to Statement Generator Application Backend");
})
module.exports = app;
