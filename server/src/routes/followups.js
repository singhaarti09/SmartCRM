const express = require("express");
const router = express.Router();
const followups = require("../data/followups");
const customers = require("../data/customers");

// GET all follow-ups
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: followups.length,
    data: followups,
  });
});

// CREATE a follow-up draft
router.post("/", (req, res) => {
  const { customerId, message } = req.body;

  if (!customerId || !message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Customer and message are required.",
    });
  }

  const customer = customers.find(
    (item) => String(item.id) === String(customerId),
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  const followup = {
    id: Date.now(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    message: message.trim(),
    status: "Draft",
    createdAt: new Date().toISOString(),
  };

  followups.unshift(followup);

  res.status(201).json({
    success: true,
    message: "Follow-up draft saved successfully.",
    data: followup,
  });
});

// UPDATE follow-up status
router.put("/:id/status", (req, res) => {
  const followup = followups.find((item) => String(item.id) === req.params.id);

  if (!followup) {
    return res.status(404).json({
      success: false,
      message: "Follow-up not found.",
    });
  }

  const allowedStatuses = ["Draft", "Approved", "Completed"];

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be Draft, Approved, or Completed.",
    });
  }

  followup.status = req.body.status;

  res.json({
    success: true,
    message: "Follow-up status updated.",
    data: followup,
  });
});

// DELETE a follow-up draft
router.delete("/:id", (req, res) => {
  const index = followups.findIndex(
    (item) => String(item.id) === req.params.id,
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Follow-up not found.",
    });
  }

  followups.splice(index, 1);

  res.json({
    success: true,
    message: "Follow-up deleted successfully.",
  });
});

module.exports = router;
