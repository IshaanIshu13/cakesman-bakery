export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  address?: string
  city?: string
  role: 'customer' | 'admin'
}

export interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  categoryId: string
  subcategoryId: string
  image: string
  inStock: boolean
  featured: boolean
  discount: number
  rating: number
  reviews: number
  deliveryTime: string
  tags?: string[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  unitPrice: number
  flavor: string
  size: string
  eggOption: string
  quantity: number
  deliveryDate?: string
  message?: string
  image: string
  category: string
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  deliveryAddress: string
  phone: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}
