import React, { useState } from "react";
import { Link } from "react-router-dom";

// Bakery Menu Items
const menuItems = [
  { label: "Home", link: "/" },
  { label: "Cakes", link: "/products/cakes" },
  { label: "Designer Cakes", link: "/products/designer-cakes" },
  { label: "Wedding Cakes", link: "/products/wedding-cakes" },
  { label: "Occasion Cakes", link: "/products/occasion" },
  { label: "Flowers", link: "/products/flowers" },
  { label: "Gift Hampers", link: "/products/gift-hampers" },
  { label: "Party Items", link: "/products/party-items" },
  { label: "Contact", link: "/contact" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((open) => !open);

  return (
    <nav aria-label="Main menu" className="relative bg-white shadow-sm">
      {/* Mobile Toggle Button */}
      <div className="px-4 md:hidden">
        <button
          aria-controls="main-menu-list"
          aria-expanded={open}
          onClick={toggleMenu}
          className="py-3 px-4 text-gray-700 hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg"
        >
          {open ? (
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </span>
          )}
        </button>
      </div>

      {/* Menu List */}
      <ul
        id="main-menu-list"
        className={`
          md:flex md:space-x-8 md:items-center md:justify-center
          ${open ? "block" : "hidden"}
          md:!block
          absolute md:static
          left-0 right-0
          bg-white md:bg-transparent
          shadow-lg md:shadow-none
          z-50
          py-4 md:py-0
          px-6 md:px-0
          space-y-4 md:space-y-0
        `}
      >
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.link}
              onClick={() => setOpen(false)}
              className="block text-gray-700 hover:text-pink-600 transition-colors py-2 md:py-4 text-sm font-medium"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}