const express = require("express");
const cors = require("cors");

const customersRouter = require("./routes/customers");
const ordersRouter = require("./routes/orders");

const followupsRouter = require("./routes/followups");
const woocommerceRouter = require("./routes/woocommerce");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SmartCRM API",
  });
});

app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/followups", followupsRouter);
app.use("/api/woocommerce", woocommerceRouter);

module.exports = app;
