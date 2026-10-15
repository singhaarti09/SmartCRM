const express = require("express");
const customers = require("../data/customers");

const router = express.Router();

// GET all customers, with optional search
router.get("/", (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  const results = customers.filter((customer) =>
    `${customer.name} ${customer.email}`.toLowerCase().includes(search),
  );

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// GET one customer
router.get("/:id", (req, res) => {
  const customer = customers.find((c) => c.id === Number(req.params.id));

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });
  }

  res.json({ success: true, data: customer });
});

// POST: Add a new customer
router.post("/", (req, res) => {
  const { name, email, orders, spent, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (customers.some((c) => c.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({
      success: false,
      message: "A customer with this email already exists",
    });
  }

  const customer = {
    id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
    name: name.trim(),
    email: normalizedEmail,
    orders:
      Number.isFinite(Number(orders)) && orders !== undefined
        ? Number(orders)
        : 0,
    spent:
      Number.isFinite(Number(spent)) && spent !== undefined ? Number(spent) : 0,
    status: status || "New",
  };

  customers.push(customer);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

// PUT: Update an existing customer
router.put("/:id", (req, res) => {
  const customer = customers.find((c) => c.id === Number(req.params.id));

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });
  }

  const { name, email, status } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }
    customer.name = name.trim();
  }

  if (email !== undefined) {
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = customers.some(
      (c) => c.id !== customer.id && c.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "A customer with this email already exists",
      });
    }

    customer.email = normalizedEmail;
  }

  if (status !== undefined) {
    customer.status = status;
  }

  res.json({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

// DELETE: Remove a customer
router.delete("/:id", (req, res) => {
  const index = customers.findIndex((c) => c.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Customer not found",
    });
  }

  const deletedCustomer = customers.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Customer deleted successfully",
    data: deletedCustomer,
  });
});

module.exports = router;
