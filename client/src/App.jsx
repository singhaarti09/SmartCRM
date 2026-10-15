import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageSquare,
  Search,
  Bell,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/customers";
const ORDERS_URL = "http://localhost:5000/api/orders";
const FOLLOWUPS_URL = "http://localhost:5000/api/followups";

const emptyCustomerForm = {
  name: "",
  email: "",
  status: "New",
};

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [followups, setFollowups] = useState([]);
  const [followupsLoading, setFollowupsLoading] = useState(true);
  const [followupsError, setFollowupsError] = useState("");
  const [selectedFollowupCustomer, setSelectedFollowupCustomer] = useState("");
  const [draft, setDraft] = useState("");
  const [savingFollowup, setSavingFollowup] = useState(false);
  const [updatingFollowupId, setUpdatingFollowupId] = useState(null);
  const [deletingFollowupId, setDeletingFollowupId] = useState(null);

  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [formError, setFormError] = useState("");
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  // Load customers
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load customers.");
      }

      setCustomers(result.data || []);
    } catch (error) {
      console.error("Customer API error:", error);
      setApiError(
        "Could not load customers. Make sure the backend is running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load orders
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const response = await fetch(ORDERS_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load orders.");
      }

      setOrders(result.data || []);
    } catch (error) {
      console.error("Orders API error:", error);
      setOrdersError(
        "Could not load orders. Make sure the backend is running.",
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Load saved follow-up drafts
  const loadFollowups = useCallback(async () => {
    setFollowupsLoading(true);
    setFollowupsError("");

    try {
      const response = await fetch(FOLLOWUPS_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load follow-ups.");
      }

      setFollowups(result.data || []);
    } catch (error) {
      console.error("Follow-ups API error:", error);
      setFollowupsError(
        "Could not load follow-ups. Make sure the backend is running.",
      );
    } finally {
      setFollowupsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
    loadOrders();
    loadFollowups();
  }, [loadCustomers, loadOrders, loadFollowups]);

  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  // Customer form actions
  const openAddForm = () => {
    setEditingCustomer(null);
    setCustomerForm(emptyCustomerForm);
    setFormError("");
    setActionMessage("");
    setShowCustomerForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      status: customer.status,
    });
    setFormError("");
    setActionMessage("");
    setShowCustomerForm(true);
  };

  const closeCustomerForm = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
    setCustomerForm(emptyCustomerForm);
    setFormError("");
  };

  // Add or edit a customer
  const handleSaveCustomer = async (event) => {
    event.preventDefault();
    setFormError("");
    setActionMessage("");

    const name = customerForm.name.trim();
    const email = customerForm.email.trim();

    if (!name || !email) {
      setFormError("Please enter both the customer's name and email.");
      return;
    }

    setSavingCustomer(true);

    try {
      const isEditing = Boolean(editingCustomer);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingCustomer.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            status: customerForm.status,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Could not save the customer.",
        );
      }

      closeCustomerForm();
      setActionMessage(
        isEditing
          ? "Customer updated successfully."
          : "Customer added successfully.",
      );

      await loadCustomers();
    } catch (error) {
      setFormError(error.message || "Something went wrong.");
    } finally {
      setSavingCustomer(false);
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      return;
    }

    setDeletingId(customer.id);
    setActionMessage("");

    try {
      const response = await fetch(`${API_URL}/${customer.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Could not delete the customer.",
        );
      }

      if (selected?.id === customer.id) {
        setSelected(null);
      }

      setActionMessage("Customer deleted successfully.");
      await loadCustomers();
    } catch (error) {
      setActionMessage(error.message || "Could not delete the customer.");
    } finally {
      setDeletingId(null);
    }
  };

  // Update an order's status
  const handleOrderStatusChange = async (order, newStatus) => {
    if (newStatus === order.status) return;

    setUpdatingOrderId(order.id);
    setOrdersError("");

    try {
      const response = await fetch(`${ORDERS_URL}/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Could not update order status.",
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.id === order.id ? { ...item, status: result.data.status } : item,
        ),
      );
    } catch (error) {
      setOrdersError(error.message || "Could not update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Prepare a follow-up message for the selected customer
  const handleFollowupCustomerChange = (customerId) => {
    setSelectedFollowupCustomer(customerId);
    setFollowupsError("");

    const customer = customers.find(
      (item) => String(item.id) === String(customerId),
    );

    setDraft(
      customer
        ? `Hi ${customer.name}, thank you for shopping with us! We wanted to check if everything is going well with your recent order. Please let us know if we can help.`
        : "",
    );
  };

  // Save a follow-up draft to the backend
  const handleSaveFollowup = async () => {
    if (!selectedFollowupCustomer || !draft.trim()) {
      setFollowupsError("Please select a customer and enter a message.");
      return;
    }

    setSavingFollowup(true);
    setFollowupsError("");

    try {
      const response = await fetch(FOLLOWUPS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedFollowupCustomer,
          message: draft.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save the follow-up.");
      }

      setFollowups((current) => [result.data, ...current]);
      setDraft("");
      setSelectedFollowupCustomer("");
      setFollowupsError("Follow-up draft saved successfully.");
    } catch (error) {
      setFollowupsError(error.message || "Could not save the follow-up.");
    } finally {
      setSavingFollowup(false);
    }
  };

  // Approve a saved follow-up draft
  const handleApproveFollowup = async (followup) => {
    setUpdatingFollowupId(followup.id);
    setFollowupsError("");

    try {
      const response = await fetch(`${FOLLOWUPS_URL}/${followup.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not approve the draft.");
      }

      setFollowups((current) =>
        current.map((item) => (item.id === followup.id ? result.data : item)),
      );
      setFollowupsError("Draft approved. No message was sent.");
    } catch (error) {
      setFollowupsError(error.message || "Could not approve the draft.");
    } finally {
      setUpdatingFollowupId(null);
    }
  };

  // Delete a saved follow-up draft
  const handleDeleteFollowup = async (followup) => {
    if (!window.confirm("Delete this follow-up draft?")) return;

    setDeletingFollowupId(followup.id);
    setFollowupsError("");

    try {
      const response = await fetch(`${FOLLOWUPS_URL}/${followup.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete the draft.");
      }

      setFollowups((current) =>
        current.filter((item) => item.id !== followup.id),
      );
      setFollowupsError("Follow-up draft deleted.");
    } catch (error) {
      setFollowupsError(error.message || "Could not delete the draft.");
    } finally {
      setDeletingFollowupId(null);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">✳ SmartCRM</h2>
        <p className="muted">WOOCOMMERCE HUB</p>

        {[
          [LayoutDashboard, "Overview"],
          [Users, "Customers"],
          [ShoppingCart, "Orders"],
          [MessageSquare, "Follow-ups"],
        ].map(([Icon, name]) => (
          <button
            key={name}
            className={`nav ${tab === name ? "active" : ""}`}
            onClick={() => setTab(name)}
          >
            <Icon size={18} /> {name}
          </button>
        ))}

        <div className="sidebar-bottom">
          ● Demo workspace
          <br />
          <span>Sample data · Not live connected</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="muted">WORKSPACE / </span>
            {tab}
          </div>
          <div className="profile">
            <Bell size={18} /> <span>Admin</span>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="muted">SMARTCRM WORKSPACE</p>
            <h1>{tab === "Overview" ? "Customer overview" : tab}</h1>
            <p className="muted">
              Manage customer relationships, orders and follow-ups in one place.
            </p>
          </div>
          <span className="demo-badge">● Demo data</span>
        </section>

        {tab === "Overview" && (
          <div className="stats">
            {[
              [
                "Total customers",
                String(customers.length),
                "Customer records in backend",
                Users,
              ],
              [
                "Orders tracked",
                String(orders.length),
                "Sample orders in backend",
                ShoppingCart,
              ],
              [
                "Follow-ups saved",
                String(followups.length),
                "Saved demo follow-ups",
                MessageSquare,
              ],
              [
                "Revenue tracked",
                formatCurrency(
                  orders.reduce(
                    (sum, order) => sum + Number(order.total || 0),
                    0,
                  ),
                ),
                "Based on sample orders",
                TrendingUp,
              ],
            ].map(([label, value, note, Icon]) => (
              <div className="stat" key={label}>
                <div className="stat-top">
                  <span>{label}</span>
                  <Icon size={19} />
                </div>
                <h2>{value}</h2>
                <p>{note}</p>
              </div>
            ))}
          </div>
        )}

        {(tab === "Overview" || tab === "Customers") && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Customer directory</h3>
                <p>Add, search, view, edit and delete customer records</p>
              </div>

              <div className="customer-tools">
                <div className="search">
                  <Search size={17} />
                  <input
                    placeholder="Search customers..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <button
                  className="primary add-customer-btn"
                  onClick={openAddForm}
                >
                  <Plus size={16} /> Add Customer
                </button>
              </div>
            </div>

            {actionMessage && (
              <p className="success" role="status">
                {actionMessage}
              </p>
            )}

            {loading && <p className="empty">Loading customers...</p>}
            {apiError && <p className="empty">{apiError}</p>}

            {showCustomerForm && (
              <form className="customer-form" onSubmit={handleSaveCustomer}>
                <div className="form-heading">
                  <h3>
                    {editingCustomer ? "Edit customer" : "Add new customer"}
                  </h3>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={closeCustomerForm}
                    aria-label="Close customer form"
                  >
                    <X size={18} />
                  </button>
                </div>

                <label htmlFor="customer-name">Full name</label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerForm.name}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                  required
                />

                <label htmlFor="customer-email">Email address</label>
                <input
                  id="customer-email"
                  type="email"
                  value={customerForm.email}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="customer@example.com"
                  required
                />

                <label htmlFor="customer-status">Status</label>
                <select
                  id="customer-status"
                  value={customerForm.status}
                  onChange={(event) =>
                    setCustomerForm({
                      ...customerForm,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Follow-up">Follow-up</option>
                </select>

                {formError && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="text-btn"
                    onClick={closeCustomerForm}
                    disabled={savingCustomer}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary"
                    disabled={savingCustomer}
                  >
                    {savingCustomer
                      ? "Saving..."
                      : editingCustomer
                        ? "Save Changes"
                        : "Add Customer"}
                  </button>
                </div>
              </form>
            )}

            {!loading && !apiError && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Orders</th>
                      <th>Total spent</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <b>{customer.name}</b>
                          <small>{customer.email}</small>
                        </td>
                        <td>{customer.orders}</td>
                        <td>{formatCurrency(customer.spent)}</td>
                        <td>
                          <span
                            className={`status ${customer.status.toLowerCase()}`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td>
                          <div className="customer-actions">
                            <button
                              className="text-btn"
                              onClick={() => setSelected(customer)}
                            >
                              View
                            </button>
                            <button
                              className="text-btn"
                              onClick={() => openEditForm(customer)}
                              aria-label={`Edit ${customer.name}`}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              className="text-btn delete-btn"
                              onClick={() => handleDeleteCustomer(customer)}
                              disabled={deletingId === customer.id}
                              aria-label={`Delete ${customer.name}`}
                            >
                              <Trash2 size={14} />
                              {deletingId === customer.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !apiError && filtered.length === 0 && (
              <p className="empty">No customers found.</p>
            )}

            {selected && (
              <div className="detail">
                <button
                  className="close"
                  onClick={() => setSelected(null)}
                  aria-label="Close customer details"
                >
                  ✕
                </button>
                <h3>{selected.name}</h3>
                <p>{selected.email}</p>
                <p>
                  {selected.orders} orders · Lifetime spend{" "}
                  {formatCurrency(selected.spent)}
                </p>
                <p>Status: {selected.status}</p>
                <button
                  className="primary"
                  onClick={() => {
                    setSelected(null);
                    openEditForm(selected);
                  }}
                >
                  <Pencil size={15} /> Edit Customer
                </button>
              </div>
            )}
          </section>
        )}

        {(tab === "Overview" || tab === "Orders") && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Order tracking</h3>
                <p>
                  View orders and update their status. These are sample records,
                  not live WooCommerce orders.
                </p>
              </div>
              <button className="text-btn" onClick={loadOrders}>
                Refresh
              </button>
            </div>

            {ordersLoading && <p className="empty">Loading orders...</p>}
            {ordersError && (
              <p className="form-error" role="alert">
                {ordersError}
              </p>
            )}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p className="empty">No orders available.</p>
            )}

            {!ordersLoading && orders.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <b>{order.orderNumber}</b>
                        </td>
                        <td>
                          <b>{order.customer}</b>
                          <small>{order.customerEmail}</small>
                        </td>
                        <td>{order.date}</td>
                        <td>{order.items}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <select
                            aria-label={`Status for ${order.orderNumber}`}
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(event) =>
                              handleOrderStatusChange(order, event.target.value)
                            }
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          {updatingOrderId === order.id && (
                            <small>Saving...</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="muted">
              Order status changes are handled by the backend. Data is held in
              memory and resets when the server restarts.
            </p>
          </section>
        )}

        {tab === "Follow-ups" && (
          <section className="panel follow">
            <h3>Customer follow-ups</h3>
            <p>
              Prepare a personalised message, save it, and approve it for
              review.
            </p>

            <label htmlFor="followup-customer">Customer</label>
            <select
              id="followup-customer"
              value={selectedFollowupCustomer}
              onChange={(event) =>
                handleFollowupCustomerChange(event.target.value)
              }
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>

            <label htmlFor="message-draft">Message draft</label>
            <textarea
              id="message-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Select a customer and prepare a follow-up message..."
            />

            <button
              className="primary"
              onClick={handleSaveFollowup}
              disabled={
                savingFollowup || !selectedFollowupCustomer || !draft.trim()
              }
            >
              <Plus size={16} />
              {savingFollowup ? "Saving..." : "Save Draft"}
            </button>

            {followupsError && (
              <p
                className={
                  followupsError.toLowerCase().includes("could not") ||
                  followupsError.toLowerCase().includes("please select")
                    ? "form-error"
                    : "success"
                }
                role="status"
              >
                {followupsError}
              </p>
            )}

            <div className="panel-head followup-list-heading">
              <div>
                <h3>Saved follow-ups</h3>
                <p>Review saved drafts and update their status.</p>
              </div>
              <button className="text-btn" onClick={loadFollowups}>
                Refresh
              </button>
            </div>

            {followupsLoading && <p className="empty">Loading follow-ups...</p>}

            {!followupsLoading && followups.length === 0 && (
              <p className="empty">No follow-up drafts saved yet.</p>
            )}

            {!followupsLoading &&
              followups.map((followup) => (
                <article className="followup-card" key={followup.id}>
                  <div className="followup-card-heading">
                    <div>
                      <h4>{followup.customerName}</h4>
                      <p>{followup.customerEmail}</p>
                    </div>
                    <span className={`status ${followup.status.toLowerCase()}`}>
                      {followup.status}
                    </span>
                  </div>

                  <p className="followup-message">{followup.message}</p>

                  <div className="followup-card-actions">
                    {followup.status === "Draft" && (
                      <button
                        className="primary"
                        onClick={() => handleApproveFollowup(followup)}
                        disabled={updatingFollowupId === followup.id}
                      >
                        {updatingFollowupId === followup.id
                          ? "Approving..."
                          : "Approve Draft"}
                      </button>
                    )}

                    <button
                      className="text-btn delete-btn"
                      onClick={() => handleDeleteFollowup(followup)}
                      disabled={deletingFollowupId === followup.id}
                    >
                      <Trash2 size={14} />
                      {deletingFollowupId === followup.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}

            <p className="muted">
              Demo only: approving a draft updates its status. No email or
              external message is sent. Follow-up records are held in memory and
              reset when the backend restarts.
            </p>
          </section>
        )}

        <footer>
          SmartCRM · Hackathon prototype · WooCommerce live integration not
          configured
        </footer>
      </main>
    </div>
  );
}
