import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

const menu = [
  { id: 1, name: "Cappuccino", price: 120 },
  { id: 2, name: "Cold Coffee", price: 150 },
  { id: 3, name: "Veg Sandwich", price: 100 },
  { id: 4, name: "French Fries", price: 90 },
];

export default function App() {
  const [user, setUser] = useState("");
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState("");

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = () => {
    const token = "SC-" + Math.floor(1000 + Math.random() * 9000);

    setOrder({
      token,
      items: cart,
      total,
      status: "Preparing",
    });

    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: "Ready for Pickup",
      }));
    }, 5000);
  };

  const collectFood = () => {
    setOrder({
      ...order,
      status: "Collected",
    });
  };

  const shareReview = () => {
    const text = `I just had amazing food at Space Cafe! ☕ ${review}`;

    if (navigator.share) {
      navigator.share({
        title: "Space Cafe Review",
        text,
      });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h1>☕ Space Cafe</h1>
        <h2>Login / Register</h2>

        <input
          placeholder="Enter your name"
          onChange={(e) => setUser(e.target.value)}
        />

        <p>Enter your name to continue</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>☕ Space Cafe</h1>
      <p>Welcome, {user}</p>

      {!order && (
        <>
          <h2>Menu</h2>

          <div className="menu">
            {menu.map((item) => (
              <div className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button onClick={() => addToCart(item)}>Add</button>
              </div>
            ))}
          </div>

          <h2>Cart</h2>

          {cart.length === 0 ? (
            <p>No items added</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <p key={index}>
                  {item.name} - ₹{item.price}
                </p>
              ))}

              <h3>Total: ₹{total}</h3>

              <button onClick={placeOrder}>
                Pay & Generate Token
              </button>
            </>
          )}
        </>
      )}

      {order && (
        <div className="order-box">
          <h2>Order Token</h2>
          <h1>{order.token}</h1>

          <QRCodeCanvas value={order.token} size={160} />

          <h3>Status: {order.status}</h3>

          {order.status === "Preparing" && (
            <p>Kitchen is preparing your food...</p>
          )}

          {order.status === "Ready for Pickup" && (
            <>
              <p>Your food is ready. Please scan QR at counter.</p>
              <button onClick={collectFood}>Scan QR & Collect Food</button>
            </>
          )}

          {order.status === "Collected" && (
            <>
              <h2>Write Review</h2>

              <textarea
                placeholder="Write your review"
                onChange={(e) => setReview(e.target.value)}
              />

              <button onClick={shareReview}>
                Share Review
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
