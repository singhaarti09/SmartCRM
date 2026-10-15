
const express = require("express");
const router = express.Router();
const { getOrders } = require("../services/woocommerce");

router.get("/orders", async (req, res) => {
  try {
    const orders = await getOrders();

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("WooCommerce order fetch failed:", error.message);

    res.status(502).json({
      success: false,
      message: "Could not fetch orders from WooCommerce.",
    });
  }
});

module.exports = router;
