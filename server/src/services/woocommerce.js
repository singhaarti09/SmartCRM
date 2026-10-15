
const STORE_URL = process.env.WOOCOMMERCE_STORE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

async function getOrders() {
  if (!STORE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("WooCommerce environment variables are missing");
  }

  const url = new URL("/index.php", STORE_URL);
  url.searchParams.set("rest_route", "/wc/v3/orders");
  url.searchParams.set("per_page", "20");

  const credentials = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });

  console.log("WooCommerce HTTP status:", response.status);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("WooCommerce API error:", errorBody);

    throw new Error(
      `WooCommerce API returned HTTP ${response.status}`
    );
  }

  return response.json();
}

module.exports = { getOrders };
