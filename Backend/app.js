const express = require("express");
const app = express();
app.use(express.json());
const companyRouter = require("./routes/companyRoutes");
const industryRouter = require("./routes/industryRoutes");
app.use("/api/companies", companyRouter);
app.use("/api/industries", industryRouter);
app.get("/", (req, res) => {
    return res.send("Welcome to Statement Generator Application Backend");
})
module.exports = app;