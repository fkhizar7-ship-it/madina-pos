import React, { useState } from 'react';

// Categories / Items with Icons (No fixed price - Manual Entry)
const CATEGORY_ITEMS = [
  { id: 1, name: 'Abaya', icon: '👗' },
  { id: 2, name: 'Chiffon Stole', icon: '🧣' },
  { id: 3, name: 'Hijab', icon: '🧕' },
  { id: 4, name: 'Shawl', icon: '🧥' },
  { id: 5, name: 'Dress', icon: '✨' },
];

export default function POSBilling() {
  const [cart, setCart] = useState([]);
  const [cashPaid, setCashPaid] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [billNo, setBillNo] = useState(104); // Dynamic Bill Number

  // States for Manual Price Modal Popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [manualPrice, setManualPrice] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [customNameInput, setCustomNameInput] = useState('');
  const [itemNote, setItemNote] = useState(''); // e.g. Black / Medium

  // When an item card is clicked
  const handleCardClick = (item) => {
    setSelectedItem(item);
    setCustomNameInput(item ? item.name : '');
    setManualPrice('');
    setManualQty(1);
    setItemNote('');
    setIsModalOpen(true);
  };

  // Add item with manual price to cart
  const handleConfirmAdd = (e) => {
    e.preventDefault();
    if (!manualPrice) return;

    const newItem = {
      id: Date.now(),
      name: customNameInput || (selectedItem ? selectedItem.name : 'Custom Item'),
      price: Number(manualPrice),
      qty: Number(manualQty),
      note: itemNote.trim(),
    };

    setCart((prev) => [...prev, newItem]);
    setIsModalOpen(false);
  };

  // Update quantity (+ or -)
  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const change = cashPaid ? Number(cashPaid) - total : 0;

  // Print function
  const handlePrint = () => {
    window.print();
    setBillNo((prev) => prev + 1); // Increment bill number for next customer
  };

  // Filter items based on search
  const filteredItems = CATEGORY_ITEMS.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Inline Print Styles to completely hide dashboard during print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .thermal-receipt, .thermal-receipt * {
            visibility: visible;
          }
          .thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm;
            margin: 0;
            padding: 4px;
            background: white;
          }
        }
      `}} />

      {/* Top Header (Hidden on print) */}
      <header className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Madina Abaya Center</h1>
          <p className="text-xs text-gray-500">Shop No. 136, Bazar Qasaban, Old Town, Gujranwala</p>
        </div>
        <div className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          Cashier: Ali
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left 2 Columns: Product Grid & Search */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Search items (e.g., Abaya, Stole)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group cursor-pointer"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <h3 className="font-semibold text-gray-800 text-base">{item.name}</h3>
                <p className="text-xs text-purple-600 mt-1 font-medium bg-purple-50 px-2 py-0.5 rounded">
                  Tap to add price
                </p>
              </button>
            ))}

            {/* Custom Item Card */}
            <button
              onClick={() => handleCardClick(null)}
              className="bg-purple-50 p-6 rounded-xl shadow hover:shadow-md transition border-2 border-dashed border-purple-300 flex flex-col items-center text-center group justify-center cursor-pointer"
            >
              <span className="text-3xl mb-1 text-purple-600 font-bold">+</span>
              <h3 className="font-semibold text-purple-800 text-sm">Other Item</h3>
              <p className="text-xs text-purple-500 mt-0.5">Manual Name & Price</p>
            </button>
          </div>
        </div>

        {/* Right Column: Current Bill & Summary */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Current Bill (#{billNo})
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-12 text-sm">
                No items added yet. Click on any item card to enter price and add.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm border"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      {item.note && <p className="text-xs text-gray-500 italic">({item.note})</p>}
                      <p className="text-xs text-gray-500 mt-0.5">
                        Rs. {item.price} x {item.qty} = <span className="font-semibold text-purple-600">Rs. {item.price * item.qty}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 bg-gray-200 rounded font-bold text-sm hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 bg-purple-600 text-white rounded font-bold text-sm hover:bg-purple-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL:</span>
              <span className="text-purple-600">Rs. {total.toLocaleString()}</span>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Cash Paid by Customer:</label>
              <input
                type="number"
                placeholder="Enter cash..."
                value={cashPaid}
                onChange={(e) => setCashPaid(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              {cashPaid && (
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  Change to Return: Rs. {change >= 0 ? change : 0}
                </p>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setCart([])}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-semibold hover:bg-gray-300"
              >
                Clear
              </button>
              <button
                onClick={handlePrint}
                disabled={cart.length === 0}
                className="w-2/3 bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                Print & Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Price & Details Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {selectedItem ? `Add ${selectedItem.name}` : 'Add Custom Item'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">Enter price, quantity & specifications.</p>

            <form onSubmit={handleConfirmAdd} className="space-y-3">
              {!selectedItem && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    placeholder="Enter item name..."
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-600 block mb-1">Price (PKR)</label>
                <input
                  type="number"
                  required
                  autoFocus
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualQty}
                    onChange={(e) => setManualQty(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Details/Note (Optional)</label>
                  <input
                    type="text"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="e.g. Black/Medium"
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700"
                >
                  Add to Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Print Slip Component (Thermal Printer 58mm Exact Format) */}
      <div className="thermal-receipt hidden print:block text-xs font-mono p-1 w-[58mm] leading-tight bg-white">
        <div className="text-center font-bold text-sm">MADINA ABAYA CENTER</div>
        <div className="text-center text-[9px]">Exclusive Abayas, Hijabs & Stoles</div>
        <div className="my-1">================================</div>
        <div className="text-center text-[9px]">Shop No. 136, Madina Center</div>
        <div className="text-center text-[9px]">Bazar Qasaban, Old Town, Gujranwala</div>
        <div className="text-center text-[9px]">Ph: +92 304 3858347 / 03237475566</div>
        <div className="my-1">================================</div>
        <div className="flex justify-between">
          <span>Bill #: #{billNo}</span>
          <span>Cashier: Ali</span>
        </div>
        <div>Date: {new Date().toLocaleDateString()} Time: {new Date().toLocaleTimeString()}</div>
        <div className="my-1">================================</div>
        <div className="grid grid-cols-4 font-bold">
          <span className="col-span-2">ITEM</span>
          <span>QTY</span>
          <span>TOT</span>
        </div>
        <div className="my-1">--------------------------------</div>
        {cart.map((item, idx) => (
          <div key={idx} className="py-0.5">
            <div className="grid grid-cols-4">
              <span className="col-span-2 font-semibold truncate">{idx + 1}. {item.name}</span>
              <span>{item.qty}</span>
              <span>{item.price * item.qty}</span>
            </div>
            {item.note && <div className="text-[9px] text-gray-600 pl-2">({item.note})</div>}
          </div>
        ))}
        <div className="my-1">--------------------------------</div>
        <div className="flex justify-between text-[10px]">
          <span>Subtotal:</span>
          <span>Rs. {total}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>Discount:</span>
          <span>Rs. 0</span>
        </div>
        <div className="my-1">--------------------------------</div>
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL AMOUNT:</span>
          <span>Rs. {total}</span>
        </div>
        <div className="my-1">================================</div>
        <div className="text-center font-semibold mt-1">THANK YOU FOR SHOPPING!</div>
        <div className="text-center text-[9px]">Visit Again for New Collection</div>
        <div className="my-1">================================</div>
        <div className="text-center font-bold text-[9px]">SOCIAL MEDIA HANDLES:</div>
        <div className="text-center text-[9px]">TikTok:Madinabayacenter</div>
        <div className="text-center text-[9px]">Facebook:MadinaAbayaCenter</div>
        <div className="text-center text-[9px]">Instagram:madina_abaya_center</div>
        <div className="my-1">================================</div>
        <div className="text-center font-bold mt-1">[ SCAN QR CODE ]</div>
        <div className="text-center text-[9px]">Scan to open Google Maps</div>
        <div className="text-center text-[9px]">& Shop Location!</div>
        {/* Render Google Maps QR code representation via API */}
        <div className="flex justify-center mt-2">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maps.app.goo.gl/89hrFi4nbrSfwrUP7`} 
            alt="Location QR" 
            className="w-20 h-20"
          />
        </div>
        <div className="my-1">================================</div>
      </div>
    </div>
  );
}