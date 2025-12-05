import axiosInstance from './axiosInstance';

export const api = {
  // Auth endpoints
  register: async (name, email, password, phone) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        phone
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getMe: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Product endpoints
  getAllProducts: async (category = "", subcategory = "", search = "") => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (subcategory) params.append("subcategory", subcategory);
      if (search) params.append("search", search);
      
      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get("/products/featured");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cart endpoints
  getCart: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      return response.data;
    } catch (error) {
      // Return empty cart if not authenticated
      if (error.response?.status === 401) {
        return { items: [] };
      }
      throw error.response?.data || error;
    }
  },

  addToCart: async (productId, quantity, flavor, size, eggOption, price) => {
    try {
      const response = await axiosInstance.post("/cart/add", {
        productId,
        quantity,
        flavor,
        size,
        eggOption,
        price
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (itemIndex, quantity) => {
    try {
      const response = await axiosInstance.put("/cart/update", {
        itemIndex,
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (itemIndex) => {
    try {
      const response = await axiosInstance.delete("/cart/remove", {
        data: { itemIndex }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const response = await axiosInstance.delete("/cart/clear");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Order endpoints
  createOrder: async (items, totalPrice, shippingAddress, phone, notes) => {
    try {
      const response = await axiosInstance.post("/orders", {
        items,
        totalPrice,
        shippingAddress,
        phone,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserOrders: async () => {
    try {
      const response = await axiosInstance.get("/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrder: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export const getToken = () => localStorage.getItem("authToken");
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const isLoggedIn = () => !!localStorage.getItem("authToken");
