# 🎬 VideoSnap Branding Guide

## Logo

### Official Logo
- **File:** `/public/logo.svg`
- **Format:** SVG (scalable, vector-based)
- **Usage:** App icon, favicon, website header
- **Colors:** 
  - Primary: `#667eea` (purple)
  - Dark: `#1e40af` (dark blue)
  - Accent: `#ef4444` (red for play button)
  - Gray: `#e5e7eb` (light gray background)

### Logo Variations

**Square Icon (App Icon)**
```html
<img src="/logo.svg" alt="VideoSnap" width="200" height="200" />
```

**Favicon (Small)**
```html
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
```

**Social Media (1200x630 - Open Graph)**
```html
<meta property="og:image" content="/logo.svg" />
```

---

## Brand Colors

| Color | Code | Usage |
|-------|------|-------|
| **Primary Purple** | `#667eea` | Main branding, buttons, accents |
| **Dark Blue** | `#1e40af` | Borders, outlines, dark elements |
| **Accent Red** | `#ef4444` | Call-to-action, play button |
| **Light Gray** | `#e5e7eb` | Backgrounds, secondary elements |
| **White** | `#ffffff` | Text, backgrounds |

---

## Typography

- **Font Family:** System fonts
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  ```

- **Headings:** Bold, larger sizes
- **Body:** Regular weight, 14-16px

---

## Design Principles

1. **Minimalist** — Clean, simple design
2. **Modern** — Contemporary gradient aesthetic
3. **Accessible** — High contrast, readable
4. **Consistent** — Same branding across all pages
5. **Responsive** — Works on all screen sizes

---

## Icon Files

### Using the Provided Icons

**Option 1: SVG Logo (Recommended)**
- File: `/public/logo.svg`
- Scalable to any size
- Best for web

**Option 2: Your Uploaded ICO**
- File: `video.ico` (uploaded)
- Use as: `/public/favicon.ico`
- Best for browser tabs

### How to Use

**In HTML:**
```html
<!-- Favicon (browser tab) -->
<link rel="icon" type="image/svg+xml" href="/logo.svg" />

<!-- App icon -->
<img src="/logo.svg" alt="VideoSnap" clase="app-logo" />
```

**In React:**
```jsx
<img src="/logo.svg" alt="VideoSnap Logo" className="app-icon-img" />
```

---

## Social Media

### Profile Pictures
- Size: 400x400px minimum
- Format: PNG with transparency
- Use: `/public/logo.svg`

### Banners
- Size: 1200x630px (Open Graph)
- Format: PNG or SVG
- Include: Logo + "VideoSnap" text

### Hashtags
- `#VideoSnap`
- `#InstagramDownloader`
- `#OpenSource`

---

## Usage Rights

- ✅ Use on your website
- ✅ Use in promotional materials
- ✅ Modify colors/size
- ✅ Use in documentation
- ❌ Don't claim as original design
- ❌ Don't trademark the logo

---

## File Locations

```
/public/
  ├── logo.svg (Main logo - use this!)
  ├── favicon.ico (Optional - if using uploaded icon)
  └── sitemap.xml
```

---

**Last Updated:** April 10, 2026
