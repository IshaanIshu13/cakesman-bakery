import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShoppingBag, Edit3, LogOut, AlertCircle,
  ChevronDown, ChevronUp, Clock, CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";

function CustomerProfile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await api.getUserOrders();
        const ordersData = response.data || response || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load orders");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Redirect is happening in useEffect
  }

  const userInitial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-pink-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-pink-400 to-amber-300"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-5xl font-bold text-white">{userInitial}</span>
                </div>
              </div>

              {/* User Info & Actions */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {user?.name || "Customer"}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4" />
                  {user?.email || "No email"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex items-center justify-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-pink-500" />
                Personal Info
              </h2>

              {/* Profile Fields */}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-pink-500" />
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-pink-500" />
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.phone || "Not provided"}
                  </p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    Date of Birth
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.dateOfBirth ? formatDate(user.dateOfBirth) : "Not provided"}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    Address
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.address || "Not provided"}
                  </p>
                </div>

                {/* Member Since */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : "Recently"}
                  </p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  To update your profile information, click "Edit Profile" above.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-pink-500" />
                Order History
              </h2>

              {/* Loading State */}
              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Start exploring our delicious bakery items and place your first order!
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                /* Orders List */
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <button
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order._id ? null : order._id)
                        }
                        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1 text-left">
                          {/* Status Icon & Badge */}
                          <div className={`p-3 rounded-lg ${getStatusColor(order.status).replace("text-", "bg-").replace("bg-", "bg-opacity-20 flex items-center justify-center")}`}>
                            {getStatusIcon(order.status)}
                          </div>

                          {/* Order Info */}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Order #{order._id?.slice(-6)?.toUpperCase() || order._id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                          </div>

                          {/* Total Amount */}
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              ₹{order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="ml-4">
                          {expandedOrder === order._id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </button>

                      {/* Order Details (Expandable) */}
                      {expandedOrder === order._id && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                          {/* Items */}
                          {order.items && order.items.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm pb-2 border-b border-gray-100 last:border-b-0">
                                    <span className="text-gray-700">
                                      {item.name || "Product"} × {item.quantity || 1}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Order Info Grid */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Order Date</p>
                              <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Delivery Type</p>
                              <p className="font-semibold text-gray-900">
                                {order.deliveryType === "pickup" ? "Pickup" : "Delivery"}
                              </p>
                            </div>
                            {order.shippingAddress && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                                <p className="font-semibold text-gray-900">{order.shippingAddress}</p>
                              </div>
                            )}
                          </div>

                          {/* Price Summary */}
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="text-gray-900 font-medium">₹{(order.subtotal || order.totalPrice)?.toFixed(2)}</span>
                            </div>
                            {order.tax > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (GST)</span>
                                <span className="text-gray-900 font-medium">₹{order.tax?.toFixed(2)}</span>
                              </div>
                            )}
                            {order.deliveryCost > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery</span>
                                <span className="text-gray-900 font-medium">₹{order.deliveryCost?.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="font-bold text-lg text-pink-600">₹{order.totalPrice?.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Order Notes */}
                          {order.notes && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Special Instructions</p>
                              <p className="text-sm text-gray-900">{order.notes}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-4 flex gap-3">
                            <button className="flex-1 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-semibold text-sm">
                              View Details
                            </button>
                            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm">
                              Reorder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about your account or orders, please don't hesitate to reach out to us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-4 py-2 border-2 border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-semibold">
              Contact Support
            </button>
            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
