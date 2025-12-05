import React, { useState, useEffect } from "react"
import { Mail, Phone, MapPin, TrendingUp, Eye, Search } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("spent") // spent, orders, name

  const token = localStorage.getItem("token")

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5001/api/customers", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomers(response.data || [])
    } catch (err) {
      toast.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDetails = async (customerId) => {
    try {
      setDetailsLoading(true)
      const response = await axios.get(`http://localhost:5001/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomerDetails(response.data)
      setSelectedCustomer(customerId)
    } catch (err) {
      toast.error("Failed to load customer details")
    } finally {
      setDetailsLoading(false)
    }
  }

  const searchCustomers = async (query) => {
    if (!query.trim()) {
      fetchCustomers()
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:5001/api/customers/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCustomers(response.data || [])
    } catch (err) {
      toast.error("Search failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSearch = (value) => {
    setSearchTerm(value)
    searchCustomers(value)
  }

  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortBy) {
      case "spent":
        return (b.totalSpent || 0) - (a.totalSpent || 0)
      case "orders":
        return (b.totalOrders || 0) - (a.totalOrders || 0)
      case "name":
        return (a.name || "").localeCompare(b.name || "")
      default:
        return 0
    }
  })

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    baking: "bg-orange-100 text-orange-800",
    out_for_delivery: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  }

  if (loading && customers.length === 0) {
    return <div className="flex items-center justify-center h-96"><div className="text-gray-500">Loading customers...</div></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        <button 
          onClick={fetchCustomers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Refresh Customers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="lg:col-span-2">
          {/* Search and Sort */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="spent">Total Spent (High to Low)</option>
                <option value="orders">Number of Orders (High to Low)</option>
                <option value="name">Name (A to Z)</option>
              </select>
            </div>
          </div>

          {/* Customers Grid */}
          <div className="space-y-3">
            {sortedCustomers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                No customers found
              </div>
            ) : (
              sortedCustomers.map(customer => (
                <div
                  key={customer._id}
                  onClick={() => fetchCustomerDetails(customer._id)}
                  className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition hover:shadow-md ${
                    selectedCustomer === customer._id ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{customer.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Total Orders</p>
                      <p className="text-lg font-bold text-gray-900">{customer.totalOrders || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Total Spent</p>
                      <p className="text-lg font-bold text-green-600">₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Joined</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Details Panel */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            detailsLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                Loading details...
              </div>
            ) : customerDetails ? (
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <h3 className="font-bold text-gray-900">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-semibold">{customerDetails.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold">{customerDetails.customer.email}</p>
                    </div>
                    {customerDetails.customer.phone && (
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-semibold">{customerDetails.customer.phone}</p>
                      </div>
                    )}
                    {customerDetails.customer.address && (
                      <div>
                        <p className="text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> Address</p>
                        <p className="font-semibold">{customerDetails.customer.address}</p>
                      </div>
                    )}
                    {customerDetails.customer.city && (
                      <div>
                        <p className="text-gray-600">City</p>
                        <p className="font-semibold">{customerDetails.customer.city}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5" />Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <span className="font-bold text-gray-900">{customerDetails.statistics.totalOrders}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-bold text-green-600">₹{customerDetails.statistics.totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <h3 className="font-bold text-gray-900">Orders by Status</h3>
                  <div className="space-y-2">
                    {Object.entries(customerDetails.statistics.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[status]}`}>
                          {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="font-bold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                {customerDetails.orders && customerDetails.orders.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                    <h3 className="font-bold text-gray-900">Recent Orders ({customerDetails.orders.length})</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {customerDetails.orders.slice(0, 5).map(order => (
                        <div key={order._id} className="p-2 border rounded text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">#{order._id?.slice(-6).toUpperCase()}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                              {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{order.items?.length} items</span>
                            <span className="font-semibold text-gray-900">₹{order.totalPrice}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerManagement
