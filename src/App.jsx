```jsx
import { useState } from "react";

function App() {
  const [item, setItem] = useState("");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [billItems, setBillItems] = useState([]);

  const addToBill = () => {
    const newItem = {
      item: item,
      rate: Number(rate),
      quantity: Number(quantity),
      total: Number(rate) * Number(quantity),
    };

    setBillItems([...billItems, newItem]);
  };

  return (
    <div>
      <h1>Shop Billing Software</h1>

      <h2>Add Item</h2>

      <select
        value={item}
        onChange={(e) => setItem(e.target.value)}
      >
        <option value="">Select Item</option>
        <option value="Abaya">Abaya</option>
        <option value="Shawls">Shawls</option>
        <option value="Stolar">Stolar</option>
        <option value="Hijab">Hijab</option>
      </select>

      <br />
      <br />

      <input
        type="number"
        placeholder="Enter rate"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addToBill}>
        Add to Bill
      </button>

      <h2>Bill</h2>

      {billItems.map((billItem, index) => (
        <p key={index}>
          {billItem.item} - Rs. {billItem.rate} × {billItem.quantity} = Rs.{" "}
          {billItem.total}
        </p>
      ))}
    </div>
  );
}

export default App;
```
