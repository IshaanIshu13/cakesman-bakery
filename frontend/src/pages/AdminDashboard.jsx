import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Package, Plus, Edit, Trash2, Save, X, ShoppingCart, Users, DollarSign, LogOut } from "lucide-react"
import { CATEGORIES } from "../data/categories"
import { toast } from "sonner"
import axios from "axios"
import { SocketContext } from "../context/SocketContext"
import OrderManagement from "../components/OrderManagement"
import CustomerManagement from "../components/CustomerManagement"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const socketContext = useContext(SocketContext)
  const { socket, products: realtimeProducts, orders: realtimeOrders } = socketContext || {}
  
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
    featured: false, discount: 0, deliveryTime: "1-2 hours", tags: []
  })

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/products")
      setProducts(response.data)
    } catch (error) { 
      toast.error("Failed to fetch products") 
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      setOrders(response.data)
    } catch (error) { 
      toast.error("Failed to fetch orders") 
    }
  }

  useEffect(() => {
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    setStats({ 
      totalProducts: products.length, 
      totalOrders: orders.length, 
      totalCustomers: uniqueCustomers, 
      totalRevenue 
    })
  }, [products, orders])

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "admin") { 
      toast.error("Access denied")
      navigate("/login")
      return 
    }
    setLoading(true)
    Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => { 
    if (realtimeProducts?.length) setProducts(realtimeProducts) 
  }, [realtimeProducts])
  
  useEffect(() => { 
    if (realtimeOrders?.length) setOrders(realtimeOrders) 
  }, [realtimeOrders])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("token")
    toast.success("Logged out")
    navigate("/")
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setFormData({ 
      name: "", description: "", basePrice: 0, categoryId: CATEGORIES[0]?.id || "", 
      subcategoryId: CATEGORIES[0]?.subcategories[0]?.id || "", image: "", inStock: true, 
      featured: false, discount: 0, deliveryTime: "1-2 hours", tags: [] 
    })
    setIsNewProduct(true)
    setIsProductModalOpen(true)
  }

  const handleEdit = (product) => { 
    setSelectedProduct(product)
    setFormData(product)
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
        basePrice: formData.basePrice,
        image: formData.image,
        featured: formData.featured,
        flavors: formData.flavors || [],
        sizes: formData.sizes || [],
        eggOptions: formData.eggOptions || []
      }

      if (isNewProduct) {
        const response = await axios.post("http://localhost:5001/api/products", productData, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
        })
        setProducts([...products, response.data])
        toast.success("Product added!")
      } else if (selectedProduct) {
        await axios.patch(`http://localhost:5001/api/products/${selectedProduct._id}`, productData, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
        })
        setProducts(products.map(p => p._id === selectedProduct._id ? { ...p, ...productData } : p))
        toast.success("Product updated!")
      }
      setIsProductModalOpen(false)
    } catch (error) { 
      console.error("Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Failed to save product") 
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`http://localhost:5001/api/products/${productId}`, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
        })
        setProducts(products.filter(p => p._id !== productId))
        toast.success("Deleted!")
      } catch (error) { 
        toast.error("Failed to delete") 
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5001/api/orders/${orderId}`, { status: newStatus }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
      })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      toast.success("Status updated!")
    } catch (error) { 
      toast.error("Failed to update") 
    }
  }

  const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId)
  const statsArray = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-500" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-green-500" },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "bg-purple-500" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-pink-500" }
  ]

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>

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
                <tbody>{products.map(p => <tr key={p._id} className="border-b hover:bg-gray-50"><td className="px-6 py-4"><img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" onError={(e) => e.target.src = "https://via.placeholder.com/64"} /></td>
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
              <div><label className="block text-sm font-semibold mb-2">Subcategory</label><select value={formData.subcategoryId} onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})} className="w-full px-4 py-2 border rounded-lg">{selectedCategory?.subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div></div>
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