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
    itemName: '',
    quantity: 1,
    price: 0.0,
    address: '',
    paymentType: 'Bank Transfer'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.customerName.trim()) {
        alert('Customer Name is required');
        return;
      }
      if (!formData.itemName.trim()) {
        alert('Item Name is required');
        return;
      }
      if (!formData.address.trim()) {
        alert('Address is required');
        return;
      }
      if (formData.quantity <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }
      if (formData.price < 0) {
        alert('Price cannot be negative');
        return;
      }

      // Convert quantity to integer and price to parseFloat for type safety
      const orderData = {
        customerName: formData.customerName.trim(),
        itemName: formData.itemName.trim(),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        address: formData.address.trim(),
        paymentType: formData.paymentType,
        status: 'Pending' // Set default status
      };

      await axios.post('http://localhost:8080/api/orders', orderData);
      fetchOrders();
      setFormData({
        customerName: '',
        itemName: '',
        quantity: 1,
        price: 0.0,
        address: '',
        paymentType: 'Bank Transfer'
      });
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
      const response = await axios.put(`http://localhost:8080/api/orders/${id}/status`, payload);

      // Update local state with the new order data
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status: editingStatus } : order
        )
      );

      setEditingOrderId(null);
      setEditingStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);

      // Handle specific error codes
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

  // Extract user initials from email or name
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label className="block text-xs font-semibold text-brand-primary mb-1">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-primary mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
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
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-brand-accent text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-150 shadow-md"
              >
                Add Order
              </button>
            </div>
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
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => statusFilter === 'All' || order.status === statusFilter)
                  .map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-brand-bg transition">
                      <td className="px-6 py-4 text-sm font-medium text-brand-primary">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.itemName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Rs {order.price}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-primary">
                        Rs {order.total ? order.total.toFixed(2) : (order.quantity * order.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.paymentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => { if (editingOrderId !== order.id) handleEditStatus(order); }}>
                        {editingOrderId === order.id ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-600 transition"
                            >
                              ✓
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full hover:opacity-80 transition
                          ${order.status === 'Finished' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'}`}>
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300 px-3 py-1 rounded-lg transition font-medium text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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
