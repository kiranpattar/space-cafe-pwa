import { useMemo, useState } from "react";
import "./App.css";

const menuItems = [
  {
    id: 1,
    name: "Cappuccino",
    category: "Hot Coffee",
    price: 120,
    emoji: "☕",
    description: "Rich espresso with steamed milk foam",
  },
  {
    id: 2,
    name: "Cold Coffee",
    category: "Cold Coffee",
    price: 150,
    emoji: "🧋",
    description: "Chilled creamy coffee with chocolate notes",
  },
  {
    id: 3,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 100,
    emoji: "🥪",
    description: "Fresh veggies, cheese and cafe-style sauce",
  },
  {
    id: 4,
    name: "French Fries",
    category: "Snacks",
    price: 90,
    emoji: "🍟",
    description: "Crispy fries served with dip",
  },
  {
    id: 5,
    name: "Brownie",
    category: "Dessert",
    price: 110,
    emoji: "🍫",
    description: "Soft chocolate brownie",
  },
  {
    id: 6,
    name: "Cafe Combo",
    category: "Combo",
    price: 220,
    emoji: "🍽️",
    description: "Coffee + sandwich combo",
  },
];

const statusSteps = ["Paid", "Preparing", "Ready for Pickup", "Collected"];

function generateToken(prefix = "SC") {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${day}${month}-${random}`;
}

export default function App() {
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState("");

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const serviceCharge = cart.length > 0 ? 10 : 0;
  const grandTotal = total + serviceCharge;

  const handleLogin = (event) => {
    event.preventDefault();

    if (!nameInput.trim() || !phoneInput.trim()) {
      alert("Please enter name and mobile number");
      return;
    }

    if (phoneInput.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    setCustomer({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
    });
  };

  const addToCart = (item) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [...previousCart, { ...item, qty: 1 }];
    });
  };

  const decreaseQty = (itemId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === itemId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const customerToken = generateToken("CUST");
    const adminToken = generateToken("ADMIN");

    setOrder({
      customerToken,
      adminToken,
      customer,
      items: cart,
      total,
      serviceCharge,
      grandTotal,
      status: "Paid",
      createdAt: new Date().toLocaleString(),
    });
  };

  const updateStatus = (nextStatus) => {
    setOrder((previousOrder) => ({
      ...previousOrder,
      status: nextStatus,
    }));
  };

  const shareReview = () => {
    const message = `I visited Space Cafe ☕\nOrder: ${order.customerToken}\nReview: ${review || "Amazing food and coffee!"}`;

    if (navigator.share) {
      navigator.share({
        title: "Space Cafe Review",
        text: message,
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  if (!customer) {
    return (
      <main className="app-shell login-page">
        <section className="login-card">
          <div className="brand-badge">☕</div>
          <h1>Space Cafe</h1>
          <p className="muted">Login or register to order fresh cafe food</p>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Customer Name
              <input
                type="text"
                value={nameInput}
                placeholder="Enter your full name"
                onChange={(event) => setNameInput(event.target.value)}
              />
            </label>

            <label>
              Mobile Number
              <input
                type="tel"
                value={phoneInput}
                placeholder="Enter mobile number"
                maxLength="10"
                onChange={(event) => {
                  const onlyNumbers = event.target.value.replace(/\D/g, "");
                  setPhoneInput(onlyNumbers);
                }}
              />
            </label>

            <button className="primary-btn" type="submit">
              Continue to Menu
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Welcome, {customer.name}</p>
          <h1>Space Cafe Ordering</h1>
          <p>Order, pay, track token, collect food, and share your review.</p>
        </div>

        <div className="hero-card">
          <span>Today&apos;s Special</span>
          <strong>Cafe Combo ₹220</strong>
        </div>
      </header>

      {!order && (
        <section className="layout">
          <section>
            <div className="section-title">
              <h2>Menu</h2>
              <span>{menuItems.length} items</span>
            </div>

            <div className="menu-grid">
              {menuItems.map((item) => (
                <article className="menu-card" key={item.id}>
                  <div className="food-emoji">{item.emoji}</div>
                  <div>
                    <p className="category">{item.category}</p>
                    <h3>{item.name}</h3>
                    <p className="description">{item.description}</p>
                  </div>

                  <div className="card-footer">
                    <strong>₹{item.price}</strong>
                    <button onClick={() => addToCart(item)}>Add</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-panel">
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
              <p className="empty-cart">No items added yet.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>₹{item.price} × {item.qty}</p>
                      </div>

                      <div className="qty-actions">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bill">
                  <div>
                    <span>Items Total</span>
                    <strong>₹{total}</strong>
                  </div>
                  <div>
                    <span>Service</span>
                    <strong>₹{serviceCharge}</strong>
                  </div>
                  <div className="grand-total">
                    <span>Grand Total</span>
                    <strong>₹{grandTotal}</strong>
                  </div>
                </div>

                <button className="primary-btn full" onClick={placeOrder}>
                  Pay & Generate Token
                </button>
              </>
            )}
          </aside>
        </section>
      )}

      {order && (
        <section className="order-layout">
          <article className="token-card customer-token">
            <p className="eyebrow">Customer Token</p>
            <h2>{order.customerToken}</h2>
            <p>Show this token at the pickup counter.</p>
          </article>

          <article className="token-card admin-token">
            <p className="eyebrow">Admin / Kitchen Token</p>
            <h2>{order.adminToken}</h2>
            <p>Use this token for kitchen display and admin tracking.</p>
          </article>

          <article className="status-card">
            <div className="section-title">
              <h2>Order Status</h2>
              <span>{order.status}</span>
            </div>

            <div className="steps">
              {statusSteps.map((step) => (
                <div
                  key={step}
                  className={`step ${
                    statusSteps.indexOf(step) <= statusSteps.indexOf(order.status)
                      ? "active"
                      : ""
                  }`}
                >
                  <span>{statusSteps.indexOf(step) + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="admin-actions">
              <button onClick={() => updateStatus("Preparing")}>Preparing</button>
              <button onClick={() => updateStatus("Ready for Pickup")}>
                Ready for Pickup
              </button>
              <button onClick={() => updateStatus("Collected")}>Collected</button>
            </div>
          </article>

          <article className="summary-card">
            <h2>Order Summary</h2>
            <p><strong>Customer:</strong> {order.customer.name}</p>
            <p><strong>Mobile:</strong> {order.customer.phone}</p>
            <p><strong>Time:</strong> {order.createdAt}</p>

            <div className="summary-list">
              {order.items.map((item) => (
                <div key={item.id}>
                  <span>{item.name} × {item.qty}</span>
                  <strong>₹{item.price * item.qty}</strong>
                </div>
              ))}
            </div>

            <div className="grand-total">
              <span>Total Paid</span>
              <strong>₹{order.grandTotal}</strong>
            </div>
          </article>

          {order.status === "Collected" && (
            <article className="review-card">
              <h2>Write Review</h2>
              <textarea
                value={review}
                placeholder="How was your coffee or food?"
                onChange={(event) => setReview(event.target.value)}
              />
              <button className="primary-btn" onClick={shareReview}>
                Share Review
              </button>
            </article>
          )}
        </section>
      )}
    </main>
  );
}
