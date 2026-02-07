import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Package, Plus, Edit, Trash2, Save, X, ShoppingCart, Users, DollarSign, LogOut } from "lucide-react"
import { CATEGORIES } from "../data/categories"
import { toast } from "sonner"
import { useAuth } from "../context/AuthContext"
import axiosInstance from "../utils/axiosInstance"
import { SocketContext } from "../context/SocketContext"
import OrderManagement from "../components/OrderManagement"
import CustomerManagement from "../components/CustomerManagement"

// Mock data for fallback when database is unavailable
const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake',
    basePrice: 350,
    image: 'https://via.placeholder.com/64?text=Chocolate+Cake',
    category: 'Cakes',
    inStock: true,
    featured: true,
    discount: 10
  },
  {
    _id: '2',
    name: 'Vanilla Cupcake',
    description: 'Soft vanilla cupcakes with frosting',
    basePrice: 80,
    image: 'https://via.placeholder.com/64?text=Vanilla+Cupcake',
    category: 'Cupcakes',
    inStock: true,
    featured: false,
    discount: 5
  },
  {
    _id: '3',
    name: 'Strawberry Pastry',
    description: 'Fresh strawberry pastry',
    basePrice: 120,
    image: 'https://via.placeholder.com/64?text=Strawberry+Pastry',
    category: 'Pastries',
    inStock: true,
    featured: true,
    discount: 0
  }
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, isAdmin, logout, loading: authLoading } = useAuth()
  const socketContext = useContext(SocketContext)
  const { products: realtimeProducts, orders: realtimeOrders } = socketContext || {}
  
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0 })
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("products") // products, orders, customers
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [formData, setFormData] = useState({
    name: "", description: "", basePrice: 0, categoryId: CATEGORIES[0]?.id || "", 
    subcategoryId: CATEGORIES[0]?.subcategories[0]?.id || "", image: "", inStock: true,
    featured: false, discount: 0
  })

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products")
      const productData = response.data.data || response.data
      setProducts(Array.isArray(productData) ? productData : [])
      console.log("✅ Products fetched:", productData?.length || 0)
    } catch (error) { 
      console.error("❌ Failed to fetch products from API:", error.message)
      setProducts(MOCK_PRODUCTS)
      toast.warning("Using demo data - Database unavailable")
    }
  }

  const fetchOrders = async () => {
    try {
      // Use admin endpoint to get all orders, not user orders
      const response = await axiosInstance.get("/orders/admin/all")
      const orderData = response.data.data || response.data
      const orders = Array.isArray(orderData) ? orderData : []
      setOrders(orders)
      console.log("✅ Orders fetched:", orders.length)
    } catch (error) { 
      console.error("❌ Failed to fetch orders from API:", error.message)
      console.error("ℹ️ Error details:", error.response?.data)
      setOrders([])
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/customers")
      const customerData = response.data.data || response.data
      const customers = Array.isArray(customerData) ? customerData : []
      // Store customers for stats calculation
      console.log("✅ Customers fetched:", customers.length)
      return customers
    } catch (error) { 
      console.error("❌ Failed to fetch customers from API:", error.message)
      console.error("ℹ️ Error details:", error.response?.data)
      return []
    }
  }

  useEffect(() => {
    // Safely extract userId, handling both direct userId and nested user._id
    const uniqueCustomers = new Set(
      orders.map(o => o.userId || (typeof o.user === 'string' ? o.user : o.user?._id)).filter(Boolean)
    ).size
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    setStats({ 
      totalProducts: products.length, 
      totalOrders: orders.length, 
      totalCustomers: uniqueCustomers, 
      totalRevenue 
    })
  }, [products, orders])

  useEffect(() => {
    // Wait for auth to finish loading before checking authorization
    if (authLoading) {
      return // Still loading, don't redirect
    }

    // Check authentication and admin status ONLY after auth loading is complete
    if (!user || !isAdmin) { 
      if (user) {
        toast.error("Access denied - Admin only")
      }
      navigate("/login")
      return 
    }
    
    // Only fetch products/orders/customers if user is authenticated admin
    const fetchAllData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchProducts(), 
          fetchOrders(), 
          fetchCustomers()
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [authLoading, user, isAdmin, navigate])

  // Only update products from socket if data is valid and not partial
  useEffect(() => { 
    if (Array.isArray(realtimeProducts) && realtimeProducts.length > 0) {
      setProducts(realtimeProducts) 
    }
  }, [realtimeProducts])
  
  // Only update orders from socket if data is valid and not partial
  useEffect(() => { 
    if (Array.isArray(realtimeOrders) && realtimeOrders.length > 0) {
      setOrders(realtimeOrders) 
    }
  }, [realtimeOrders])

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    navigate("/")
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setFormData({ 
      name: "", description: "", basePrice: 0, categoryId: CATEGORIES[0]?.id || "", 
      subcategoryId: CATEGORIES[0]?.subcategories[0]?.id || "", image: "", inStock: true, 
      featured: false, discount: 0
    })
    setIsNewProduct(true)
    setIsProductModalOpen(true)
  }

  const handleEdit = (product) => { 
    // Map category/subcategory names from product back to IDs for form
    const categoryId = product.categoryId || CATEGORIES.find(c => c.name === product.category)?.id || CATEGORIES[0]?.id || ""
    const subCat = CATEGORIES.find(c => c.id === categoryId)?.subcategories.find(s => s.name === product.subcategory)
    const subcategoryId = product.subcategoryId || subCat?.id || CATEGORIES.find(c => c.id === categoryId)?.subcategories[0]?.id || ""
    
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      image: product.image,
      inStock: product.inStock ?? true,
      featured: product.featured ?? false,
      discount: product.discount ?? 0
    })
    setIsNewProduct(false)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!formData.name.trim()) { 
      toast.error("Product name required")
      return 
    }
    try {
      // Map form data to API schema
      const selectedCat = CATEGORIES.find(c => c.id === formData.categoryId)
      const selectedSubcat = selectedCat?.subcategories.find(s => s.id === formData.subcategoryId)
      
      const productData = {
        name: formData.name,
        description: formData.description,
        category: selectedCat?.name || "",
        subcategory: selectedSubcat?.name || "",
        basePrice: Number(formData.basePrice) || 0,
        image: formData.image,
        featured: Boolean(formData.featured),
        inStock: Boolean(formData.inStock),
        discount: Number(formData.discount) || 0
      }

      if (isNewProduct) {
        const response = await axiosInstance.post("/products", productData)
        const newProduct = response.data.data || response.data
        setProducts([...products, newProduct])
        toast.success(response.data.message || "Product added successfully!")
      } else if (selectedProduct) {
        const response = await axiosInstance.patch(`/products/${selectedProduct._id}`, productData)
        const updatedProduct = response.data.data || response.data
        setProducts(products.map(p => p._id === selectedProduct._id ? updatedProduct : p))
        toast.success(response.data.message || "Product updated successfully!")
      }
      setIsProductModalOpen(false)
      setSelectedProduct(null)
    } catch (error) { 
      const errorMsg = error.response?.data?.message || error.message || "Failed to save product"
      console.error("❌ Save product error:", errorMsg)
      toast.error(errorMsg) 
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Delete this product?")) {
      try {
        const response = await axiosInstance.delete(`/products/${productId}`)
        setProducts(products.filter(p => p._id !== productId))
        toast.success(response.data.message || "Deleted!")
      } catch (error) { 
        console.error("❌ Delete error:", error)
        toast.error(error.response?.data?.message || "Failed to delete") 
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}`, { status: newStatus })
      const updatedOrder = response.data.data || response.data
      setOrders(orders.map(o => o._id === orderId ? updatedOrder : o))
      toast.success(response.data.message || "Status updated!")
    } catch (error) { 
      console.error("❌ Update order error:", error)
      toast.error(error.response?.data?.message || "Failed to update") 
    }
  }

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId)
  const statsArray = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-500" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-green-500" },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "bg-purple-500" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-pink-500" }
  ]

  if (loading || authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b"><div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between">
        <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><Package className="w-6 h-6 text-amber-600" /></div>
          <div><h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1><p className="text-sm text-gray-600">Cakes Man Bakery</p></div></div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/")} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">View Website</button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"><LogOut className="w-4 h-4" /><span>Logout</span></button></div></div></div></header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsArray.map((stat, i) => <div key={i} className="bg-white rounded-xl shadow-sm p-6"><div className="flex items-center justify-between">
            <div><p className="text-gray-600 text-sm mb-1">{stat.label}</p><p className="text-2xl font-bold text-amber-900">{stat.value}</p></div>
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-6 h-6 text-white" /></div></div></div>)}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab("products")} className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap ${activeTab === "products" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}`}><Package className="inline w-5 h-5 mr-2" />Products ({products.length})</button>
          <button onClick={() => setActiveTab("orders")} className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap ${activeTab === "orders" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}`}><ShoppingCart className="inline w-5 h-5 mr-2" />Orders ({orders.length})</button>
          <button onClick={() => setActiveTab("customers")} className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap ${activeTab === "customers" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}`}><Users className="inline w-5 h-5 mr-2" />Customers</button>
        </div>

        {activeTab === "products" && (
          <div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b flex items-center justify-between"><h2 className="text-xl font-bold text-amber-900">Products</h2>
            <button onClick={handleAddNew} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add</span></button></div>
            <div className="overflow-x-auto">{products.length === 0 ? <div className="p-12 text-center"><p className="text-gray-500">No products</p></div> : 
              <table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left text-xs font-medium">Image</th><th className="px-6 py-3 text-left text-xs font-medium">Name</th><th className="px-6 py-3 text-left text-xs font-medium">Price</th><th className="px-6 py-3 text-left text-xs font-medium">Discount</th><th className="px-6 py-3 text-left text-xs font-medium">Status</th><th className="px-6 py-3 text-left text-xs font-medium">Actions</th></tr></thead>
                <tbody>{products.map(p => <tr key={p._id} className="border-b hover:bg-gray-50"><td className="px-6 py-4"><img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" onError={(e) => { if (e.target.src !== "https://via.placeholder.com/64") e.target.src = "https://via.placeholder.com/64" }} /></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium">{p.name}</p></td><td className="px-6 py-4 text-sm">₹{p.basePrice}</td>
                  <td className="px-6 py-4"><span className={p.discount ? "px-2 py-1 bg-green-100 text-green-800 text-xs rounded" : "text-gray-400 text-xs"}>{p.discount ? `${p.discount}%` : "-"}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded ${p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{p.inStock ? "In" : "Out"}</span></td>
                  <td className="px-6 py-4"><button onClick={() => handleEdit(p)} className="p-1 text-blue-600 hover:bg-blue-100 rounded mr-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="p-1 text-red-600 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4" /></button></td></tr>)}
                </tbody></table>}</div></div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <OrderManagement />
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CustomerManagement />
          </div>
        )}
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between"><div><h2 className="text-xl font-bold">{isNewProduct ? "Add" : "Edit"} Product</h2></div>
            <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100"><X className="w-6 h-6" /></button></div>
          <div className="p-6 space-y-4">
            <div><label className="block text-sm font-semibold mb-2">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" /></div>
            <div><label className="block text-sm font-semibold mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold mb-2">Category</label><select value={formData.categoryId} onChange={(e) => { const newCatId = e.target.value; const newSubcatId = CATEGORIES.find(c => c.id === newCatId)?.subcategories[0]?.id; setFormData({...formData, categoryId: newCatId, subcategoryId: newSubcatId}) }} className="w-full px-4 py-2 border rounded-lg">{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold mb-2">Subcategory</label><select value={formData.subcategoryId} onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})} className="w-full px-4 py-2 border rounded-lg">{selectedCategory && selectedCategory.subcategories ? selectedCategory.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : null}</select></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold mb-2">Price</label><input type="number" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-semibold mb-2">Discount %</label><input type="number" value={formData.discount || 0} onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" /></div></div>
            <div><label className="block text-sm font-semibold mb-2">Image URL</label><input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div className="flex items-center space-x-4"><label className="flex items-center"><input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({...formData, inStock: e.target.checked})} className="mr-2" /><span className="text-sm">In Stock</span></label>
              <label className="flex items-center"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="mr-2" /><span className="text-sm">Featured</span></label></div>
          </div>
          <div className="sticky bottom-0 bg-white border-t p-6 flex space-x-3"><button onClick={handleSaveProduct} className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold"><Save className="inline w-4 h-4 mr-2" />{isNewProduct ? "Add" : "Save"}</button>
            <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button></div></div></div>
      )}
    </div>
  )
}

export default AdminDashboard