# Order Management System - Design Components Reference

## Quick Reference Guide for Components

### 1. Header Component
**Color Scheme**: Dark Navy Background, Cream Title, Gold Accent

```jsx
<header className="bg-brand-primary shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <img src="/src/LOGO.png" alt="Logo" className="h-10 w-10" />
      <h1 className="text-3xl font-bold text-brand-light">Order Management</h1>
    </div>
    <p className="text-brand-accent font-semibold">Professional Order Tracking</p>
  </div>
</header>
```

**Classes Used:**
- `bg-brand-primary` - Dark navy background
- `text-brand-light` - Cream text
- `text-brand-accent` - Gold accent text
- `shadow-md` - Subtle shadow

---

### 2. Section Title with Accent Line
**Used for**: "Add New Order" and "Current Orders" headings

```jsx
<h2 className="text-2xl font-bold text-brand-primary mb-6 flex items-center">
  <span className="w-1 h-8 bg-brand-accent rounded mr-3"></span>
  Add New Order
</h2>
```

**Classes Used:**
- `text-brand-primary` - Dark navy text
- `bg-brand-accent` - Gold accent line
- `w-1 h-8` - Thin vertical line (1px wide, 2rem tall)
- `mr-3` - Space between line and text

---

### 3. Form Input Field
**Color Scheme**: Subtle borders, gold focus rings

```jsx
<div>
  <label className="block text-sm font-semibold text-brand-primary mb-2">
    Customer Name
  </label>
  <input
    type="text"
    name="customerName"
    value={formData.customerName}
    onChange={handleInputChange}
    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
    required
  />
</div>
```

**Classes Used:**
- `text-brand-primary` - Label color (dark navy)
- `border-gray-200` - Subtle gray border
- `focus:ring-2 focus:ring-brand-accent` - Gold focus ring
- `focus:border-transparent` - Hide border on focus
- `transition` - Smooth transition effect

---

### 4. Primary Button (Add Order)
**Color Scheme**: Gold background, dark navy text

```jsx
<button
  type="submit"
  className="w-full bg-brand-accent text-brand-primary font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-150 shadow-md"
>
  Add Order
</button>
```

**Classes Used:**
- `bg-brand-accent` - Gold background
- `text-brand-primary` - Dark navy text
- `font-semibold` - Bold text
- `py-3 px-6` - Generous padding
- `hover:bg-opacity-90` - Slightly transparent on hover
- `shadow-md` - Depth effect

---

### 5. Secondary Button (Delete)
**Color Scheme**: Outlined style, gray default, red on hover

```jsx
<button
  onClick={() => handleDelete(order.id)}
  className="border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300 px-3 py-1 rounded-lg transition font-medium"
>
  Delete
</button>
```

**Classes Used:**
- `border border-gray-300` - Subtle gray border
- `text-gray-600` - Medium gray text
- `hover:text-red-600 hover:border-red-300` - Red on hover
- `px-3 py-1` - Compact padding
- `font-medium` - Medium weight font
- `transition` - Smooth color change

---

### 6. Table Header
**Color Scheme**: Dark navy text with minimal styling

```jsx
<thead>
  <tr className="border-b border-gray-200">
    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">
      ID
    </th>
    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-primary uppercase tracking-wider">
      Customer
    </th>
    {/* More headers... */}
  </tr>
</thead>
```

**Classes Used:**
- `text-brand-primary` - Dark navy headers
- `uppercase tracking-wider` - Professional styling
- `border-b border-gray-200` - Subtle border
- `px-6 py-4` - Proper spacing

---

### 7. Table Row
**Color Scheme**: Clean white with hover effect

```jsx
<tbody>
  {orders.map((order) => (
    <tr key={order.id} className="border-b border-gray-200 hover:bg-brand-bg transition">
      <td className="px-6 py-4 text-sm font-medium text-brand-primary">
        {order.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {order.customerName}
      </td>
      {/* More cells... */}
    </tr>
  ))}
</tbody>
```

**Classes Used:**
- `hover:bg-brand-bg` - Light background on hover
- `border-b border-gray-200` - Subtle border
- `text-brand-primary` - Dark navy for emphasis
- `text-gray-700` - Standard gray text
- `transition` - Smooth hover effect

---

### 8. Status Badge
**Color Scheme**: Contextual colors based on status

```jsx
<span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full 
  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
    'bg-red-100 text-red-800'}`}>
  {order.status}
</span>
```

**Color Mapping:**
- **Delivered**: Green (`bg-green-100 text-green-800`)
- **Pending**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Shipped**: Blue (`bg-blue-100 text-blue-800`)
- **Cancelled**: Red (`bg-red-100 text-red-800`)

---

### 9. Card Container
**Color Scheme**: White background with subtle borders and shadows

```jsx
<div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
  {/* Content */}
</div>
```

**Classes Used:**
- `bg-white` - Clean white background
- `p-8` - Generous padding
- `rounded-lg` - Rounded corners
- `shadow-sm` - Subtle shadow
- `border border-gray-100` - Very subtle border
- `mb-8` - Space below

---

### 10. Empty State
**Color Scheme**: Subtle gray text

```jsx
<p className="text-center text-gray-400 py-8 text-sm">
  No orders found. Create one to get started.
</p>
```

**Classes Used:**
- `text-gray-400` - Subtle gray color
- `text-center` - Center alignment
- `py-8` - Vertical padding
- `text-sm` - Small text

---

## Color Variable Reference

```javascript
// From tailwind.config.js
colors: {
  brand: {
    primary: '#1A2B23',    // Deep dark navy - Used for headers, text, primary elements
    secondary: '#344E41',  // Dark green - Alternative dark tone (not heavily used)
    accent: '#C5A059',     // Gold - Used for buttons, active states, highlights
    light: '#F5F1E3',      // Cream - Light text on dark backgrounds
    bg: '#F8F9FA'          // Light grey - Main content area background
  }
}
```

---

## Tailwind Class Naming Convention

### Primary Colors
```
bg-brand-primary   → Dark navy background
text-brand-primary → Dark navy text
border-brand-primary → Dark navy border

bg-brand-accent    → Gold background
text-brand-accent  → Gold text
focus:ring-brand-accent → Gold focus ring

bg-brand-bg        → Light off-white background
text-brand-light   → Cream text
```

---

## Usage Examples

### Creating a New Badge Component
```jsx
<span className="inline-block bg-brand-accent text-brand-primary px-3 py-1 rounded-lg font-semibold text-sm">
  Featured
</span>
```

### Creating a New Feature Box
```jsx
<div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
  <h3 className="text-brand-primary font-bold mb-2">Feature Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Creating a Secondary Action
```jsx
<button className="border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-primary px-4 py-2 rounded-lg transition">
  Secondary Action
</button>
```

### Creating a Disabled State
```jsx
<button disabled className="bg-brand-accent text-brand-primary opacity-50 cursor-not-allowed px-4 py-2 rounded-lg">
  Disabled Button
</button>
```

---

## CSS Custom Styles

### Custom Scrollbar
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #c5a059;  /* Gold accent */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b39350;  /* Darker gold */
}
```

---

## Responsive Breakpoints

The design uses Tailwind's default responsive breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

**Example**:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 1 column on mobile, 2 columns on medium screens and up */}
</div>
```

---

## Font Weights

- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700

**Example**:
```jsx
<p className="font-medium">Medium weight</p>
<p className="font-semibold">Semibold weight</p>
<p className="font-bold">Bold weight</p>
```

---

## Spacing Scale

- `p-2` = 0.5rem (8px)
- `p-3` = 0.75rem (12px)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)
- `mb-2` = margin-bottom 0.5rem
- `mb-4` = margin-bottom 1rem
- `mb-6` = margin-bottom 1.5rem
- `mb-8` = margin-bottom 2rem

---

**Last Updated:** February 17, 2025
**Design System Version:** 1.0
**Status:** Ready for Production
