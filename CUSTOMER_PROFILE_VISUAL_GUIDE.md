# Customer Profile Page - Visual Guide & Features

## 📸 Page Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR                                │
│  🧁 Cakes Man Bakery    [Search]    Cart    [Avatar]👤       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PROFILE HEADER                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │        [GRADIENT BACKGROUND - Pink to Amber]            │ │
│  │                                                         │ │
│  │    ⭕ AVATAR with        John Doe                       │ │
│  │   (Initials)        📧 john@example.com                │ │
│  │                                                         │ │
│  │                  [Edit Profile]  [Logout]              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                TWO-COLUMN LAYOUT                             │
│                                                              │
│ ┌──────────────────────┐  ┌─────────────────────────────┐   │
│ │ PERSONAL INFORMATION │  │   ORDER HISTORY             │   │
│ │                      │  │                             │   │
│ │ 👤 Email             │  │ 📦 Order #A1B2C3           │   │
│ │    john@example...   │  │    7 Feb 2026 | ✅ Delivered│   │
│ │                      │  │    ₹500                     │   │
│ │ 📱 Phone             │  │    [Click to expand]        │   │
│ │    +91 98765 43210   │  │                             │   │
│ │                      │  │ 📦 Order #D4E5F6           │   │
│ │ 🎂 Date of Birth     │  │    5 Feb 2026 | ⏳ Pending  │   │
│ │    15 Jan 1990       │  │    ₹350                     │   │
│ │                      │  │    [Click to expand]        │   │
│ │ 📍 Address           │  │                             │   │
│ │    123 Main St, City │  │ [Loading Orders...]         │   │
│ │                      │  │                             │   │
│ │ 📅 Member Since      │  │                             │   │
│ │    7 Feb 2026        │  │                             │   │
│ │                      │  │                             │   │
│ │ ℹ️ Info Banner       │  │                             │   │
│ │ "To update your      │  │                             │   │
│ │  profile info,       │  │                             │   │
│ │  click Edit Profile" │  │                             │   │
│ └──────────────────────┘  └─────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   HELP SECTION                               │
│  Need Help? [Contact Support]  [FAQs]                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Detailed Section Breakdown

### SECTION 1: Profile Header

```
╔═════════════════════════════════════════════════╗
║         GRADIENT HEADER (Pink → Amber)          ║
║                                                 ║
║              ╔═══════════════╗                  ║
║              ║      JD       ║  John Doe        ║
║              ║   (Avatar)    ║  john@ex...      ║
║              ╚═══════════════╝                  ║
║                                                 ║
║          [🖊️ Edit Profile]  [🚪 Logout]        ║
╚═════════════════════════════════════════════════╝
```

**Features:**
- Circular avatar with user initials
- Large greeting with name
- Email display
- Two action buttons:
  - Edit Profile (for future implementation)
  - Logout (functional)
- Gradient background for visual appeal

---

### SECTION 2: Personal Information (Left Sidebar)

```
╔══════════════════════════════════════╗
║     👤 PERSONAL INFORMATION          ║
╠══════════════════════════════════════╣
║                                      ║
║  📧 Email                            ║
║  john@example.com                    ║
║  ─────────────────────────────────   ║
║                                      ║
║  📱 Phone                            ║
║  +91 98765 43210                     ║
║  ─────────────────────────────────   ║
║                                      ║
║  🎂 Date of Birth                    ║
║  15 Jan 1990                         ║
║  ─────────────────────────────────   ║
║                                      ║
║  📍 Address                          ║
║  123 Main Street, City, State        ║
║  ─────────────────────────────────   ║
║                                      ║
║  📅 Member Since                     ║
║  7 Feb 2026                          ║
║  ─────────────────────────────────   ║
║                                      ║
║  ℹ️ ┌──────────────────────────┐    ║
║     │ To update your profile   │    ║
║     │ information, click the   │    ║
║     │ "Edit Profile" button    │    ║
║     │ above.                   │    ║
║     └──────────────────────────┘    ║
║                                      ║
╚══════════════════════════════════════╝
```

**Features:**
- Icon indicators for each field
- Clean field formatting
- "Not provided" for missing data
- Helpful info banner
- Sticky on large screens (stays visible while scrolling)
- Color-coded icons (all pink)

---

### SECTION 3: Order History (Right Column)

```
╔═══════════════════════════════════════════════════════════╗
║              📦 ORDER HISTORY                              ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ ✅ Order #A1B2C3                      7 Feb 2026    │  ║
║  │    🟢 Delivered    |                    ₹500        │  ║
║  │ [Click to expand ▼]                                 │  ║
║  │                                                      │  ║
║  │ ✓ Items:                                            │  ║
║  │   • Chocolate Cake × 1 ..................... ₹450   │  ║
║  │   • Vanilla Cupcakes × 1 .................... ₹50   │  ║
║  │ ─────────────────────────────────────────────────   │  ║
║  │ Subtotal:     ₹500                                  │  ║
║  │ Tax (GST):    ₹25                                   │  ║
║  │ Delivery:     Free                                  │  ║
║  │ Total:        ₹525                                  │  ║
║  │ ─────────────────────────────────────────────────   │  ║
║  │ 📍 Delivery: 123 Main St, City                      │  ║
║  │ 💬 "Please ring bell twice"                         │  ║
║  │ ─────────────────────────────────────────────────   │  ║
║  │ [View Details]        [Reorder]                     │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                            ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ ⏳ Order #D4E5F6                      5 Feb 2026    │  ║
║  │    🟡 Pending     |                    ₹350         │  ║
║  │ [Click to expand ▼]                                 │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                            ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ ❌ Order #G7H8I9                      2 Feb 2026    │  ║
║  │    🔴 Cancelled   |                    ₹200         │  ║
║  │ [Click to expand ▼]                                 │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

**Features:**
- Order cards in collapsible format
- Status indicators (color + icon + text)
- Quick view of order ID, date, total
- Expandable to show full details
- Items list with quantities and prices
- Price breakdown (subtotal, tax, delivery)
- Address and special instructions
- Action buttons for each order

---

## 🎨 Visual Elements & Icons

### Status Indicators

```
Delivered:  ✅ 🟢 Green background, checkmark icon
Pending:    ⏳ 🟡 Yellow background, clock icon
Cancelled:  ❌ 🔴 Red background, X mark icon
Processing: 🔵 Blue background, clock icon
```

### Section Icons

```
👤 Profile Header       (User profile)
📧 Email               (Mail)
📱 Phone               (Telephone)
🎂 Birthday            (Cake/Calendar)
📍 Address             (Location pin)
📅 Member Since        (Calendar)
📦 Order ID            (Package)
🚪 Logout              (Door/Exit)
🖊️ Edit                (Pencil)
ℹ️ Information          (Info badge)
💬 Notes               (Chat bubble)
```

---

## 🔄 Interaction Flows

### Expand Order Details
```
1. User sees order summary card
2. Clicks on the order card
3. Card expands with smooth animation
4. Chevron icon changes ▼ → ▲
5. Full order details appear
6. User clicks again to collapse
```

### Logout Flow
```
1. User clicks [Logout] button
2. System logs them out
3. Toast notification appears
4. User redirected to home page
5. Can log back in with credentials
```

### Navigate to Edit Profile
```
1. User clicks [Edit Profile]
2. (Feature ready for future implementation)
3. Can add form modal or new page
4. Save changes back to profile
```

---

## 📱 Responsive Breakpoints

### Desktop (≥1024px)
```
┌──────────────────────────────────────┐
│          FULL WIDTH                  │
├──────────────────┬───────────────────┤
│   SIDEBAR        │   MAIN CONTENT    │
│   (Sticky)       │   (Scrollable)    │
│                  │                   │
│   Personal Info  │   Orders          │
│   - Email        │   - Order 1       │
│   - Phone        │   - Order 2       │
│   - Address      │   - Order 3       │
│                  │                   │
└──────────────────┴───────────────────┘
```

### Tablet (768px - 1023px)
```
┌──────────────────────────────────────┐
│      RESPONSIVE GRID LAYOUT          │
│  ┌───────────────┬──────────────┐   │
│  │   Sidebar     │   Orders     │   │
│  │   (Adjusted)  │   (Adjusted) │   │
│  └───────────────┴──────────────┘   │
└──────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────┐
│   SINGLE COLUMN     │
│                     │
│ Header (Full Width) │
│                     │
│ Personal Info       │
│ (Full Width)        │
│                     │
│ Orders              │
│ (Full Width)        │
│                     │
│ Help Section        │
│ (Full Width)        │
└─────────────────────┘
```

---

## 🎨 Color Palette

### Primary Colors
```
Pink (#ec4899)
  - Buttons
  - Icons
  - Hover states
  - Accents

Amber (#f59e0b)
  - Header gradient
  - Secondary accents

Cream/Off-White (#f5f5f0)
  - Page background
  - Subtle backgrounds
```

### Status Colors
```
✅ Green (#22c55e)  - Delivered
⏳ Yellow (#eab308) - Pending
❌ Red (#ef4444)    - Cancelled
🔵 Blue (#3b82f6)  - Processing
```

### Text Colors
```
Headings: Dark Gray (#111827)
Body:     Medium Gray (#4b5563)
Labels:   Light Gray (#6b7280)
Borders:  Light Gray (#e5e7eb)
```

---

## ✨ Animations & Transitions

```
Hover on Cards:
  - Subtle shadow increase
  - Smooth color transition (0.3s)

Click to Expand:
  - Smooth height animation
  - Icon rotation: ▼ → ▲

Button Hover:
  - Background color change
  - Slight color darkening
  - Cursor pointer

Loading State:
  - Spinning circle animation
  - Pink color (#ec4899)
  - Smooth rotation
```

---

## 🎯 User Journey

### First-Time User
```
1. Navigate to My Profile
2. See personal information
3. View order history (if any)
4. Click "Shop Now" if no orders
5. Return to profile after ordering
```

### Returning Customer
```
1. Click My Profile
2. Review past orders
3. Click order to see details
4. Use "Reorder" to quickly add items
5. Check if information needs updating
```

### Logout Flow
```
1. Click Logout
2. See confirmation toast
3. Redirected to home
4. Must login again to access profile
```

---

## 📊 Data Presentation Examples

### Example 1: Complete Order
```
Order #F1G2H3 | 7 Feb 2026 | ✅ Delivered | ₹1,050

Items:
  • Red Velvet Cake (1kg) × 1 ............ ₹800
  • Chocolate Brownies (1 dozen) × 1 .... ₹250

Subtotal:                             ₹1,050
Tax (5% GST):                         ₹52.50
Delivery:                             Free
─────────────────────────────────────────
TOTAL:                                ₹1,102.50

📍 123 Main Street, Apt 4B, City
💬 "Use fork, no spoon. Deliver after 6 PM"

[View Details] [Reorder]
```

### Example 2: No Orders
```
╔═════════════════════════════════════════╗
║                                         ║
║              No orders yet             ║
║                                         ║
║    🛍️  Start exploring our delicious   ║
║        bakery items and place your     ║
║        first order!                    ║
║                                         ║
║              [Shop Now]                ║
║                                         ║
╚═════════════════════════════════════════╝
```

### Example 3: Empty Information
```
📱 Phone: Not provided
🎂 Date of Birth: Not provided
📍 Address: Not provided
```

---

## 🔐 Security & Privacy

✅ **Only your data shows** - Each user sees only their orders  
✅ **Authentication required** - Must be logged in  
✅ **Token-based** - Secure JWT tokens for requests  
✅ **No sensitive data** - Passwords never shown  
✅ **Secure logout** - Tokens cleared on logout  

---

## 🚀 Ready for Future Features

### Phase 2 UI (Already in place)
- [ ] Edit Profile - Form to update information
- [ ] View Details - Full order detail page
- [ ] Reorder - Quick reorder functionality

### Phase 3 UI (Can be added)
- [ ] Track Order - Real-time tracking
- [ ] Download Invoice - PDF generation
- [ ] Leave Reviews - Product reviews
- [ ] Download Invoice - PDF invoices
- [ ] Download Invoice - PDF invoices

---

## 📐 Component Dimensions

```
Avatar:              w-32 h-32 (128px × 128px)
Card Padding:        p-8 (32px)
Border Radius:       rounded-2xl (16px)
Icon Size:           w-4 h-4 to w-6 h-6 (16-24px)
Button Padding:      px-6 py-2 (horizontal-vertical)
Max Width Container: 4xl (56rem / 896px)
```

---

## 🎓 Key Design Principles

1. **Visual Hierarchy** - Important info first, details expandable
2. **Consistency** - Same styling throughout
3. **Responsiveness** - Works on all devices
4. **Accessibility** - Clear labels and readable text
5. **Performance** - Fast load and smooth interactions
6. **User-Friendly** - Intuitive navigation and clear instructions
7. **Professional** - Polished, premium appearance
8. **Bakery-Themed** - Soft colors matching brand

---

## 🎉 Summary

Your new Customer Profile page features:
- ✅ Professional design matching brand colors
- ✅ Clear personal information display
- ✅ Expandable order history with details
- ✅ Status tracking with visual indicators
- ✅ Responsive design for all devices
- ✅ Smooth animations and interactions
- ✅ Helpful loading and empty states
- ✅ Ready for future enhancements

**Visit `http://localhost:3000/profile` to see it now!** 🚀
