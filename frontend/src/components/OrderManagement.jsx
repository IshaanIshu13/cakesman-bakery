import React, { useState, useEffect } from "react"
import { Clock, CheckCircle2, Truck, Phone, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const token = localStorage.getItem("token")

  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending", icon: Clock },
    accepted: { bg: "bg-blue-100", text: "text-blue-800", label: "Accepted", icon: CheckCircle2 },
    baking: { bg: "bg-orange-100", text: "text-orange-800", label: "Baking", icon: Clock },
    out_for_delivery: { bg: "bg-purple-100", text: "text-purple-800", label: "Out for Delivery", icon: Truck },
    completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed", icon: CheckCircle2 },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled", icon: Phone }
  }

  const statusFlow = ["pending", "accepted", "baking", "out_for_delivery", "completed"]

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5001/api/orders/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data || [])
    } catch (err) {
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o
      ))
      
      toast.success(`Order status updated to ${statusColors[newStatus].label}`)
      
      // Here you would integrate with WhatsApp/SMS service
      // Example: triggerCustomerNotification(orderId, newStatus)
    } catch (err) {
      toast.error("Failed to update order status")
    }
  }

  const handleContactCustomer = (order) => {
    const phone = order.phone || order.userId?.phone
    const message = `Hi ${order.userId?.name}, your order ${order._id?.slice(-6).toUpperCase()} status is: ${statusColors[order.status].label}`
    
    // WhatsApp integration (you can implement actual SMS/WhatsApp API later)
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast.success("Opening WhatsApp...")
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch = 
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.includes(searchTerm)
    
    return matchesStatus && matchesSearch
  })

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-gray-500">Loading orders...</div></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search by Customer / Email / Order ID</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="baking">Baking</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {orders.length === 0 ? "No orders yet" : "No matching orders found"}
          </div>
        ) : (
          <div className="divide-y">
            {filteredOrders.map(order => {
              const statusInfo = statusColors[order.status] || statusColors.pending
              const StatusIcon = statusInfo.icon
              const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1]
              
              return (
                <div key={order._id} className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Order #{order._id?.slice(-6).toUpperCase()}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.text} flex items-center gap-1`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      {expandedOrder === order._id ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Customer</p>
                      <p className="font-semibold text-sm">{order.userId?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Items</p>
                      <p className="font-semibold text-sm">{order.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Price</p>
                      <p className="font-semibold text-sm">₹{order.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-semibold text-sm">{order.phone || order.userId?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        Mark as {statusColors[nextStatus].label}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleContactCustomer(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact via WhatsApp
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Customer Information */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span> {order.userId?.name}
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span> {order.userId?.email}
                          </div>
                          <div>
                            <span className="text-gray-600">Phone:</span> {order.phone || order.userId?.phone}
                          </div>
                          <div>
                            <span className="text-gray-600">City:</span> {order.userId?.city || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                        <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                      </div>

                      {/* Items */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm p-2 border-b last:border-b-0">
                              <div>
                                <p className="font-semibold">{item.name}</p>
                                {item.flavor && <p className="text-xs text-gray-600">Flavor: {item.flavor}</p>}
                                {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{item.subtotal}</p>
                                <p className="text-xs text-gray-600">@ ₹{item.price} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="text-xl font-bold text-gray-900">₹{order.totalPrice}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Payment Method: {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : order.paymentMethod}
                        </p>
                      </div>

                      {/* Special Notes */}
                      {order.notes && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Special Notes</h4>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}

                      {/* Status Update Options */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {statusFlow.map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(order._id, status)}
                              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                                order.status === status
                                  ? `${statusColors[status].bg} ${statusColors[status].text}`
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {statusColors[status].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderManagement
