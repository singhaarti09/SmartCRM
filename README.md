# SmartCRM – WooCommerce Customer Hub

SmartCRM is a customer relationship management (CRM) dashboard prototype designed to help e-commerce businesses manage customer information, track orders, and organize customer follow-ups in one place.

The project was developed as a hackathon prototype with a focus on simplifying customer management through a clean dashboard and REST API.

## ✨ Features

### 📊 Dashboard
- Overview of customer, order, and follow-up information.
- Quick access to the main CRM sections.

### 👥 Customer Management
- View and search customer records.
- Add new customers.
- Update customer details and status.
- Delete customer records.
- Validate required fields and email addresses.

### 🛍️ Order Management
- View sample order records.
- Search and filter orders.
- View order details and totals.
- Update order statuses, including Pending, Processing, Shipped, Delivered, and Cancelled.

### 💬 Customer Follow-ups
- Create customer follow-up message drafts.
- Associate follow-ups with customers.
- Approve or complete follow-ups by updating their status.
- Delete follow-up records.

*Approving a follow-up updates its status only; it does not send an email or message.*

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- CSS
- Lucide React icons

**Backend**
- Node.js
- Express.js
- REST API
- CORS

**Testing**
- Jest
- Supertest

## 📁 Project Structure

```text
SmartCRM/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── data/            # Sample data
│   │   ├── routes/          # API routes
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/singhaarti09/SmartCRM.git
cd SmartCRM
```

### 2. Start the backend

Open a terminal in the project root and run:

```bash
cd server
npm install
npm run dev
```

The backend API runs at:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### 3. Start the frontend

Open a **second terminal** in the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

Keep both terminals running while using the application.

## 🔗 API Endpoints

The backend exposes the following REST API endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/customers` | List and search customers |
| GET | `/api/customers/:id` | Get a customer |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |
| GET | `/api/orders` | List and filter orders |
| GET | `/api/orders/:id` | Get an order |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/followups` | List follow-ups |
| POST | `/api/followups` | Create a follow-up draft |
| PUT | `/api/followups/:id/status` | Update follow-up status |
| DELETE | `/api/followups/:id` | Delete a follow-up |

### Example API requests

Search customers:

```http
GET /api/customers?search=Priya
```

Filter orders by status:

```http
GET /api/orders?status=Processing
```

Create a customer:

```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com"
}
```

## 🧪 Running Tests

From the `server` directory, run:

```bash
npm test
```

This executes the backend test suite configured in the project.

## ⚠️ Current Limitations

- **Demo data:** Customers and orders are currently represented by sample records.
- **In-memory storage:** Changes made through the API are not permanently stored and may reset when the backend restarts.
- **WooCommerce integration:** A live WooCommerce store connection has not yet been configured. Real store data is not being fetched.
- **Follow-up messaging:** Follow-ups are saved as drafts, and status changes do not send actual emails or messages.

## 🔮 Future Improvements

- Integrate the official WooCommerce REST API.
- Add persistent database storage.
- Synchronize real customer and order information.
- Implement automated email or messaging workflows.
- Add authentication and role-based access control.
- Deploy the frontend and backend for online access.

## 🎯 Project Goal

SmartCRM aims to provide a simple, centralized workspace for managing e-commerce customers, monitoring orders, and organizing customer follow-ups.


## 🎥 Project Demonstration Video

Watch the 2-minute SmartCRM demonstration to see the dashboard, customer management, order tracking, and follow-up features in action.

**Demo Video:** https://drive.google.com/file/d/1uTZI4j02l4IFmbFO7JLIcJoUaym2dd6U/view?usp=sharing
---

**Project:** SmartCRM – WooCommerce Customer Hub  
**Type:** Hackathon prototype  
**Repository:** [GitHub – SmartCRM](https://github.com/singhaarti09/SmartCRM)
