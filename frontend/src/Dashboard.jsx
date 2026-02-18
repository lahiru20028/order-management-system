import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    paymentType: 'Bank Transfer'
  });
  const [items, setItems] = useState([{ itemName: '', quantity: 1, price: 0.0 }]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Please check if the backend server is running.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 1, price: 0.0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return; // Keep at least one item
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.customerName.trim()) {
        alert('Customer Name is required');
        return;
      }
      if (!formData.address.trim()) {
        alert('Address is required');
        return;
      }
      // Validate items
      for (let i = 0; i < items.length; i++) {
        if (!items[i].itemName.trim()) {
          alert(`Item ${i + 1}: Item Name is required`);
          return;
        }
        if (items[i].quantity <= 0) {
          alert(`Item ${i + 1}: Quantity must be greater than 0`);
          return;
        }
        if (items[i].price < 0) {
          alert(`Item ${i + 1}: Price cannot be negative`);
          return;
        }
      }

      const orderData = {
        customerName: formData.customerName.trim(),
        address: formData.address.trim(),
        paymentType: formData.paymentType,
        status: 'Pending',
        items: items.map(item => ({
          itemName: item.itemName.trim(),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };

      await axios.post('http://localhost:8080/api/orders', orderData);
      fetchOrders();
      setFormData({
        customerName: '',
        address: '',
        paymentType: 'Bank Transfer'
      });
      setItems([{ itemName: '', quantity: 1, price: 0.0 }]);
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      fetchOrders();
      alert('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete order';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditStatus = (order) => {
    setEditingOrderId(order.id);
    setEditingStatus(order.status);
  };

  const handleStatusUpdate = async (id) => {
    try {
      const payload = { status: editingStatus };
      await axios.put(`http://localhost:8080/api/orders/${id}/status`, payload);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status: editingStatus } : order
        )
      );

      setEditingOrderId(null);
      setEditingStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.response?.status === 403) {
        alert('Access Denied: You do not have permission to update this order.');
      } else if (error.response?.status === 500) {
        alert('Server Error: An error occurred while updating the order. Please try again.');
      } else {
        alert(`Error: ${error.response?.data?.message || error.message || 'Failed to update status'}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditingStatus('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setShowUserMenu(false);
    onLogout();
  };

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="bg-brand-primary shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/src/LOGO.png" alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-brand-accent" />
            <h1 className="text-3xl font-bold" style={{ color: '#C5A059' }}>Order Management</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent text-brand-primary font-bold text-lg hover:bg-opacity-90 transition"
              title={user?.email || 'User Profile'}
            >
              {getUserInitial()}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                  {user?.email}
                </div>
                <button
                  onClick={() => {
                    alert('Switching Account...');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand-bg transition"
                >
                  Switch Account
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-brand-primary mb-3 flex items-center">
            <span className="w-1 h-6 bg-brand-accent rounded mr-2"></span>
            Add New Order
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Order-level fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-primary mb-1">Payment Type</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="COD">COD</option>
                </select>
              </div>
            </div>

            {/* Items section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-brand-primary">Order Items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs bg-brand-accent text-brand-primary font-semibold px-3 py-1 rounded-lg hover:bg-opacity-90 transition"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{index + 1}</span>
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition text-sm"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      className="w-20 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition text-sm"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-28 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition text-sm"
                      required
                    />
                    <span className="text-xs text-gray-500 w-24 text-right font-medium">
                      Rs {(parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 transition text-lg font-bold px-1"
                        title="Remove item"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-accent text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-150 shadow-md"
            >
              Add Order
            </button>
          </form>
        </div>

        {/* Orders Table Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-primary flex items-center">
              <span className="w-1 h-6 bg-brand-accent rounded mr-2"></span>
              Current Orders
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-brand-primary">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition text-sm"
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Finished">Finished</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#1A2B23' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => statusFilter === 'All' || order.status === statusFilter)
                  .map((order) => {
                    const itemCount = order.items && order.items.length > 0 ? order.items.length : 1;
                    return (order.items && order.items.length > 0 ? order.items : [null]).map((item, idx) => (
                      <tr key={`${order.id}-${idx}`} className="bg-white hover:bg-gray-50 transition" style={{ borderBottom: idx === itemCount - 1 ? '2px solid #1A2B23' : '1px solid #e5e7eb' }}>
                        {idx === 0 && (
                          <>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm font-bold align-top" style={{ color: '#C5A059' }}>{order.id}</td>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm font-medium align-top" style={{ color: '#1A2B23' }}>{order.customerName}</td>
                          </>
                        )}
                        {item ? (
                          <>
                            <td className="px-4 py-2 text-sm font-medium" style={{ color: '#1A2B23' }}>{item.itemName}</td>
                            <td className="px-4 py-2 text-sm text-center" style={{ color: '#1A2B23' }}>{item.quantity}</td>
                            <td className="px-4 py-2 text-sm" style={{ color: '#1A2B23' }}>Rs {Number(item.price).toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm font-medium" style={{ color: '#1A2B23' }}>Rs {(item.price * item.quantity).toFixed(2)}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2 text-sm" colSpan={3} style={{ color: '#1A2B23' }}>No items</td>
                            <td className="px-4 py-2 text-sm" style={{ color: '#1A2B23' }}>-</td>
                          </>
                        )}
                        {idx === 0 && (
                          <>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm font-bold align-top" style={{ color: '#C5A059' }}>
                              Rs {order.total ? order.total.toFixed(2) : '0.00'}
                            </td>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm align-top" style={{ color: '#1A2B23' }}>{order.address}</td>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm align-top" style={{ color: '#1A2B23' }}>{order.paymentType}</td>
                            <td rowSpan={itemCount} className="px-4 py-3 whitespace-nowrap text-sm cursor-pointer align-top" onClick={() => { if (editingOrderId !== order.id) handleEditStatus(order); }}>
                              {editingOrderId === order.id ? (
                                <div className="flex gap-2 items-center">
                                  <select
                                    value={editingStatus}
                                    onChange={(e) => setEditingStatus(e.target.value)}
                                    className="px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    style={{ border: '1px solid #1A2B23', color: '#1A2B23' }}
                                    autoFocus
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Finished">Finished</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(order.id);
                                    }}
                                    className="px-2 py-1 rounded text-xs font-semibold transition"
                                    style={{ backgroundColor: '#C5A059', color: '#1A2B23' }}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelEdit();
                                    }}
                                    className="px-2 py-1 rounded text-xs font-semibold transition"
                                    style={{ backgroundColor: '#1A2B23', color: '#FFFFFF' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full" style={
                                  order.status === 'Pending' ? { backgroundColor: '#F59E0B', color: '#FFFFFF' } :
                                    order.status === 'Shipped' ? { backgroundColor: '#3B82F6', color: '#FFFFFF' } :
                                      order.status === 'Finished' ? { backgroundColor: '#10B981', color: '#FFFFFF' } :
                                        order.status === 'Cancelled' ? { backgroundColor: '#EF4444', color: '#FFFFFF' } :
                                          { backgroundColor: '#C5A059', color: '#FFFFFF' }
                                }>
                                  {order.status}
                                </span>
                              )}
                            </td>
                            <td rowSpan={itemCount} className="px-4 py-3 text-sm align-top">
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="px-3 py-1 rounded-lg transition font-semibold text-xs"
                                style={{ border: '2px solid #C5A059', color: '#1A2B23', backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#C5A059'; e.target.style.color = '#FFFFFF'; }}
                                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#1A2B23'; }}
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ));
                  })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">No orders found. Create one to get started.</p>
            )}
            {orders.length > 0 && orders.filter((order) => statusFilter === 'All' || order.status === statusFilter).length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">No orders found with status: {statusFilter}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
