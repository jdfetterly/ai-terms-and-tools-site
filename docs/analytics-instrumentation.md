# GA4 Click Tracking Instrumentation Guide
For: https://generativeaiexplained.com  
Last Updated: 2025-07-14  
Owner: JD Fetterly (@realJDFetterly)

---

## Overview

This document outlines all custom click tracking implemented using Google Analytics 4 (GA4) `gtag()` events. Cursor and other agents should reference this when updating or maintaining instrumentation.

Each tracked UI element below includes:
- Event name
- Associated parameters
- GA4 reporting tips

---

## 📌 Tracked Events

### 1. Request New Term Button
- **Selector**: `#request-new-term` (or update if ID/class changes)
- **Event**: `request_new_term_click`
- **Parameters**:  
  ```js
  { button_location: 'main_page' }
  ```

---

### 2. Social Links in Footer Sidebar

| Platform  | Selector                          | Event               | Parameter                |
|-----------|-----------------------------------|---------------------|--------------------------|
| LinkedIn  | `.footer-link.linkedin`           | `social_link_click` | `{ platform: 'linkedin' }` |
| X (Twitter) | `.footer-link.x`                | `social_link_click` | `{ platform: 'x' }` |
| Email     | `.footer-link.email`              | `social_link_click` | `{ platform: 'email' }` |
| RSS       | `.footer-link.rss`                | `social_link_click` | `{ platform: 'rss' }` |

---

### 3. Filter Buttons (Glossary Section)

| Label              | Selector              | Event                  | Parameter                        |
|--------------------|-----------------------|------------------------|----------------------------------|
| All Terms          | `.filter-btn.all`     | `filter_button_click`  | `{ filter_type: 'all' }`         |
| Interactive Tools  | `.filter-btn.tools`   | `filter_button_click`  | `{ filter_type: 'interactive_tools' }` |
| Guides             | `.filter-btn.guides`  | `filter_button_click`  | `{ filter_type: 'guides' }`      |

---

### 4. Subscribe Button (Newsletter Signup via HubSpot)
- **Selector**: `#subscribe-button` (or class used)
- **Event**: `subscribe_button_click`
- **Parameters**:  
  ```js
  { destination: 'hubspot_form' }
  ```

---

## 🧪 GA4 Setup Notes

- All events use the `gtag('event', ...)` method.
- Base GA4 tag is assumed to be already installed in `<head>`.
- Custom dimensions can be created in GA4 for:
  - `button_location`
  - `platform`
  - `filter_type`
  - `destination`

## 🛠️ Maintenance Notes

- If new buttons, CTAs, or form links are added, update this file first.
- Always validate event firing in GA4 DebugView or Realtime before publishing.

---

## Example Script Snippet

```js
onClick="gtag('event', 'subscribe_button_click', { destination: 'hubspot_form' });"
```

---

## Author Notes

If you are updating this file, follow the format and validate naming consistency across GA4.
