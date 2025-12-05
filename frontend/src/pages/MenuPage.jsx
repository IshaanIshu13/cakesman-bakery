import { useState } from "react";

// ✅ Flavour Cakes
import chocochip from "../assets/images/chocochip.jpg";
import blackforest from "../assets/images/blackforest.jpg";
import redvelvet from "../assets/images/redvelvet.jpg";
import butterscotch from "../assets/images/butterscotch.jpg";
import pineapple from "../assets/images/pineapple.jpg";
import blackcurrent from "../assets/images/blackcurrent.jpg";
import kitkat from "../assets/images/kitkat.jpg";
import strawberry from "../assets/images/strawberry.jpg";

// ✅ Pastries
import pastryChocochip from "../assets/images/pastry-chocochip.jpg";
import pastryBlackforest from "../assets/images/pastry-blackforest.jpg";
import pastryRedvelvet from "../assets/images/pastry-redvelvet.jpg";
import pastryButterscotch from "../assets/images/pastry-butterscotch.jpg";
import pastryPineapple from "../assets/images/pastry-pineapple.jpg";

// ✅ Kids Cakes
import dollcake from "../assets/images/dollcake.jpg";
import mickey from "../assets/images/mickeymouse.jpg";
import doremon from "../assets/images/doremon.jpg";
import ironman from "../assets/images/ironman.jpg";
import jungle from "../assets/images/jungle.jpg";

// ✅ Party Items
import balloons from "../assets/images/balloons.png";
import partycap from "../assets/images/birthday-cap.png";
import partypopper from "../assets/images/party-popper.png";
import sparklecandle from "../assets/images/sparkle_candle.png";

export default function MenuPage() {
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("1 kg");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedColor, setSelectedColor] = useState("white");
  const [productOptions, setProductOptions] = useState({});

  // ✅ Categories
  const categories = [
    { id: "all", name: "All Items", icon: "🍰" },
    { id: "flavour", name: "Flavour Cakes", icon: "🍫" },
    { id: "pastries", name: "Pastries", icon: "🥧" },
    { id: "kids", name: "Kids Birthday Cakes", icon: "🎂" },
    { id: "wedding", name: "Wedding Cakes", icon: "👰" },
    { id: "office", name: "Office/College Cakes", icon: "🏢" },
    { id: "party", name: "Party Items", icon: "🎉" },
  ];

  // ✅ Products with proper imported images
  const products = [
    // Flavour Cakes
    { id: 1, name: "Chocochip", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: chocochip },
    { id: 2, name: "Black Forest", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: blackforest },
    { id: 3, name: "Red Velvet", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: redvelvet },
    { id: 4, name: "Butterscotch", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: butterscotch },
    { id: 5, name: "Pineapple", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: pineapple },
    { id: 6, name: "Black Current", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: blackcurrent },
    { id: 7, name: "KitKat", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: kitkat },
    { id: 8, name: "Strawberry", price: 380, originalPrice: 400, categoryId: "flavour", weight: "1 kg", image: strawberry },

    // Pastries
    { id: 20, name: "Chocochip Pastry", price: 50, originalPrice: 60, categoryId: "pastries", weight: "1 piece", image: pastryChocochip },
    { id: 21, name: "Black Forest Pastry", price: 50, originalPrice: 60, categoryId: "pastries", weight: "1 piece", image: pastryBlackforest },
    { id: 22, name: "Red Velvet Pastry", price: 50, originalPrice: 60, categoryId: "pastries", weight: "1 piece", image: pastryRedvelvet },
    { id: 23, name: "Butterscotch Pastry", price: 50, originalPrice: 60, categoryId: "pastries", weight: "1 piece", image: pastryButterscotch },
    { id: 24, name: "Pineapple Pastry", price: 50, originalPrice: 60, categoryId: "pastries", weight: "1 piece", image: pastryPineapple },

    // Kids Cakes
    { id: 30, name: "Doll Cake", price: 150, categoryId: "kids", image: dollcake },
    { id: 31, name: "Mickey Mouse Cake", price: 150, categoryId: "kids", image: mickey },
    { id: 32, name: "Doremon Cake", price: 150, categoryId: "kids", image: doremon },
    { id: 33, name: "Iron Man Cake", price: 150, categoryId: "kids", image: ironman },
    { id: 34, name: "Jungle Cake", price: 150, categoryId: "kids", image: jungle },

    // Party Items
    { id: 60, name: "Balloons", price: 45, originalPrice: 50, categoryId: "party", image: balloons },
    { id: 61, name: "Party Cap", price: 45, originalPrice: 50, categoryId: "party", image: partycap },
    { id: 62, name: "Party Popper", price: 45, originalPrice: 50, categoryId: "party", image: partypopper },
    { id: 63, name: "Sparkle Candle", price: 45, originalPrice: 50, categoryId: "party", image: sparklecandle },
  ];

  const isCake = (product) => ["flavour", "kids", "wedding", "office"].includes(product.categoryId);
  const isBalloon = (product) => product.id === 60;

  // ✅ Add to cart with modal handling
  const handleAddToCart = (product) => {
    if (isCake(product) || isBalloon(product)) {
      setSelectedSize("1 kg");
      setSelectedFlavor("");
      setSelectedColor("white");
      setCurrentProduct(product);
      setShowModal(true);
      return;
    }
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    if (!productOptions[product.id]) {
      setProductOptions((prev) => ({ ...prev, [product.id]: {} }));
    }
  };

  const confirmAddToCart = () => {
    const product = currentProduct;
    let options = {};
    if (isCake(product)) {
      options = { size: selectedSize, flavor: selectedFlavor };
    } else if (isBalloon(product)) {
      options = { color: selectedColor };
    }
    setProductOptions((prev) => ({ ...prev, [product.id]: options }));
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    setShowModal(false);
    setCurrentProduct(null);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prev) => {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      });
      setProductOptions((prev) => {
        const newOptions = { ...prev };
        delete newOptions[productId];
        return newOptions;
      });
    } else {
      setCart((prev) => ({ ...prev, [productId]: newQuantity }));
    }
  };

  // ✅ Sidebar
  const CategorySidebar = ({ categories, selectedCategory, onCategorySelect }) => (
    <aside className="w-64 bg-white shadow-lg p-6 min-h-screen">
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-pink-100 to-orange-100 text-pink-600 font-semibold shadow-md border-l-4 border-pink-500"
                : "hover:bg-gray-50 hover:shadow-sm"
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );

  // ✅ Product Grid
  const ProductGrid = ({ products, selectedCategory, onAddToCart, cartItems, updateCartQuantity }) => {
    const filteredProducts =
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.categoryId === selectedCategory);

    return (
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {categories.find(c => c.id === selectedCategory)?.name || "All Items"}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} items available</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl"
            >
              <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                {product.weight && <p className="text-gray-500 text-sm mb-3">{product.weight}</p>}
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-pink-600 font-bold text-lg">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
                  )}
                </div>
                
                {cartItems[product.id] ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 bg-pink-50 rounded-full px-3 py-2">
                      <button
                        onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                        className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm hover:bg-pink-600 transition-colors duration-150"
                      >
                        −
                      </button>
                      <span className="font-semibold text-pink-600 min-w-[20px] text-center">
                        {cartItems[product.id]}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                        className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm hover:bg-pink-600 transition-colors duration-150"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-md"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  };

  // ✅ Modal
  const Modal = () => {
    if (!currentProduct) return null;
    const isCakeProduct = isCake(currentProduct);
    const isBalloonProduct = isBalloon(currentProduct);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Select Options for {currentProduct.name}</h3>
          
          {isCakeProduct && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {[1,2,3,4,5].map((kg) => (
                    <option key={kg} value={`${kg} kg`}>{kg} kg</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Flavor</label>
                <input
                  type="text"
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  placeholder="Enter flavor"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </>
          )}
          
          {isBalloonProduct && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="white">White</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddToCart}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onAddToCart={handleAddToCart}
          cartItems={cart}
          updateCartQuantity={updateCartQuantity}
        />
      </div>
      {showModal && <Modal />}
    </div>
  );
}
