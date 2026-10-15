const express = require("express");
const router = express.Router();
const orders = require("../data/orders");

// GET all orders, with optional search and status filters
router.get("/", (req, res) => {
  let results = [...orders];

  const search = (req.query.search || "").toLowerCase().trim();
  const status = (req.query.status || "").toLowerCase().trim();

  if (search) {
    results = results.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search),
    );
  }

  if (status) {
    results = results.filter((order) => order.status.toLowerCase() === status);
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// GET one order by ID
router.get("/:id", (req, res) => {
  const order = orders.find((item) => String(item.id) === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

// UPDATE an order's status
router.put("/:id/status", (req, res) => {
  const order = orders.find((item) => String(item.id) === req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  const allowedStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const newStatus = req.body.status;

  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Choose a valid order status.",
    });
  }

  order.status = newStatus;

  res.json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});

module.exports = router;
