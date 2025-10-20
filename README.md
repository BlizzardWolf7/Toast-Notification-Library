# 🍞 Toast Notification Library

A lightweight, customizable JavaScript library for creating beautiful toast notifications in any web project.  
Perfect for alerts, confirmations, and status messages — without adding heavy dependencies.

🔗 **Demo & Documentation:** [simonringwelski.dk/ressourcer/toast-notification-library](https://simonringwelski.dk/ressourcer/toast-notification-library/)

---

## ✨ Features

- 🚀 **Lightweight** – No external dependencies
- 🎨 **Customizable** – Colors, positions, and animations
- ⏳ **Auto-dismiss** – Or keep it until user closes it
- 📱 **Responsive** – Works on all screen sizes
- 🔧 **Easy setup** – Drop in and go
- 🎯 **Multiple types** – Success, error, warning, info, reminder, and custom notifications
- ⏸️ **Smart interactions** – Pause on hover, clickable toasts with destinations
- ⏱️ **Progress indicators** – Optional timer bars to show remaining time

---

## 📦 Installation

### Option 1: Direct Download
Download `toast.js` and `toast.css` from this repository and include them in your project:

```html
<link rel="stylesheet" href="toast.css">
<script src="toast.js"></script>
```

### Option 2: CDN
```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/BlizzardWolf7/Toast-Notification-Library@main/toast.css">
  <script src="https://cdn.jsdelivr.net/gh/BlizzardWolf7/Toast-Notification-Library@main/toast.js"></script>
```

---

## 🚀 Quick Start

Create your first toast notification in seconds:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="toast.css">
</head>
<body>
    <button onclick="showToast()">Show Toast</button>
    
    <script src="toast.js"></script>
    <script>
        function showToast() {
            showToast({
                text: "Your task was completed successfully!",
                type: "success",
                duration: 3000
            });
        }
    </script>
</body>
</html>
```

## 📚 Usage Examples

### Basic Toast
```javascript
showToast({
    text: "Hello, World!",
    type: "info"
});
```

### Success Notification
```javascript
showToast({
    text: "File uploaded successfully!",
    type: "success",
    duration: 4000
});
```

### Error Alert with Close Button
```javascript
showToast({
    text: "Something went wrong. Please try again.",
    type: "error",
    duration: 5000,
    close: true
});
```

### Permanent Toast (Manual Dismiss)
```javascript
showToast({
    text: "This toast will stay until you close it",
    type: "warning",
    duration: 0, // 0 means permanent
    close: true
});
```

### Clickable Toast with Link
```javascript
showToast({
    text: "New update available! Click to learn more.",
    type: "info",
    destination: "https://example.com/updates",
    newWindow: true,
    duration: 0
});
```

### Custom Positioned Toast
```javascript
showToast({
    text: "Centered notification",
    type: "reminder",
    position: "center",
    duration: 3000
});
```

### Toast with Timer Bar
```javascript
showToast({
    text: "Download will start in a moment...",
    type: "info",
    showTimerBar: true,
    stopOnFocus: true,
    duration: 5000
});
```

---

## ⚙️ Configuration Options

| Option         | Type    | Default       | Description                                                                |
|----------------|---------|---------------|----------------------------------------------------------------------------|
| `text`         | String  | `""`          | **Required.** The message text displayed in the toast                     |
| `type`         | String  | `"info"`      | Toast type: `"success"`, `"error"`, `"warning"`, `"info"`, `"reminder"`, `"custom"` |
| `position`     | String  | `"top-right"` | Position: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`, `"center"` |
| `duration`     | Number  | `3000`        | Auto-dismiss time in milliseconds (use `0` for permanent)                 |
| `close`        | Boolean | `true`        | Show/hide the close button                                                |
| `stopOnFocus`  | Boolean | `true`        | Pause auto-dismiss timer when hovering over toast                         |
| `destination`  | String  | `null`        | URL to navigate to when toast is clicked                                  |
| `newWindow`    | Boolean | `true`        | Open destination links in new tab/window                                  |
| `showTimerBar` | Boolean | `true`        | Display progress bar showing remaining time                                |
| `customStyles` | Object  | `{}`          | Custom styling options (see Custom Styling section below)                 |

---

## 🖌️ Customization

### Custom Styles Object
The `customStyles` option allows you to completely customize the appearance of your toasts:

```javascript
showToast({
    text: "Custom styled toast!",
    type: "custom",
    customStyles: {
        background: "#ff6b6b",           // Background color
        color: "#ffffff",                // Text color
        icon: "🎉",                      // Custom icon
        fontSize: "16px",                // Font size
        borderRadius: "12px",            // Border radius
        padding: "16px 20px",            // Padding
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)", // Box shadow
        animationSpeed: "0.3s",          // Animation duration
        customClass: "my-custom-toast"   // Additional CSS class
    }
});
```

### Custom Styles Properties

| Property        | Type   | Description                                    | Example                                |
|-----------------|--------|------------------------------------------------|----------------------------------------|
| `background`    | String | Background color (any CSS color format)       | `"#ff6b6b"`, `"rgb(255,107,107)"`     |
| `color`         | String | Text color                                     | `"#ffffff"`, `"white"`                 |
| `icon`          | String | Custom icon (emoji or text)                   | `"🎉"`, `"✓"`, `"⚠️"`                  |
| `fontSize`      | String | Font size with CSS units                      | `"16px"`, `"1.2em"`                   |
| `borderRadius`  | String | Border radius with CSS units                  | `"12px"`, `"0.75rem"`                 |
| `padding`       | String | Padding with CSS units                        | `"16px 20px"`, `"1rem 1.5rem"`        |
| `boxShadow`     | String | Box shadow CSS property                       | `"0 8px 32px rgba(0,0,0,0.12)"`       |
| `animationSpeed`| String | Animation duration                            | `"0.3s"`, `"300ms"`                    |
| `customClass`   | String | Additional CSS class name                     | `"my-custom-toast"`                    |

### Override Default Styles with CSS
You can also customize by overriding the default CSS classes:

```css
/* Custom colors for default types */
.toast.success {
    background-color: #10b981;
    border-left-color: #059669;
}

.toast.error {
    background-color: #ef4444;
    border-left-color: #dc2626;
}

.toast.reminder {
    background-color: #8b5cf6;
    border-left-color: #7c3aed;
}

/* Custom positioning */
.toast-container.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Custom animations */
.toast {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Theme Examples

#### Dark Theme Toast
```javascript
showToast({
    text: "Dark theme notification",
    type: "custom",
    customStyles: {
        background: "#1f2937",
        color: "#f9fafb",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        borderRadius: "8px"
    }
});
```

#### Gradient Toast
```javascript
showToast({
    text: "Beautiful gradient toast!",
    type: "custom",
    customStyles: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)"
    }
});
```

---

## 🌟 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

---

## 📖 API Reference

### showToast(options)
Creates and displays a new toast notification.

**Parameters:**
- `options` (Object) - Configuration object with the properties listed in the table above

**Returns:**
- Toast element (for advanced manipulation if needed)

### Complete Example
```javascript
showToast({
  text: "Your message here",           // Required
  type: "success",                     // Optional: success|error|warning|info|reminder|custom
  position: "top-right",               // Optional: top-left|top-right|bottom-left|bottom-right|center
  duration: 3000,                      // Optional: milliseconds
  close: true,                         // Optional: show close button
  stopOnFocus: true,                   // Optional: pause on hover
  destination: "https://example.com",  // Optional: make toast clickable
  newWindow: true,                     // Optional: open links in new tab
  showTimerBar: true,                  // Optional: show progress bar
  customStyles: {                      // Optional: custom styling
    background: "#ff6b6b",
    color: "#ffffff",
    icon: "🎉",
    fontSize: "16px",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    animationSpeed: "0.3s",
    customClass: "my-custom-toast"
  }
});
```

### Integration Examples

#### Form Validation
```javascript
// Form submission with validation
document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        showToast({
            text: "Please enter your email address",
            type: "error",
            position: "top-right"
        });
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showToast({
            text: "Form submitted successfully!",
            type: "success",
            showTimerBar: true
        });
    }, 1000);
});
```

#### File Upload Progress
```javascript
function uploadFile() {
    showToast({
        text: "Uploading file...",
        type: "info",
        duration: 0,
        showTimerBar: false,
        close: false
    });
    
    // Simulate upload completion
    setTimeout(() => {
        showToast({
            text: "File uploaded successfully!",
            type: "success",
            destination: "/files/uploaded",
            newWindow: false
        });
    }, 3000);
}
```

#### Shopping Cart Notifications
```javascript
function addToCart(productName) {
    showToast({
        text: `${productName} added to cart!`,
        type: "success",
        position: "bottom-right",
        duration: 2000,
        customStyles: {
            background: "#059669",
            icon: "🛒"
        }
    });
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- 🎨 Five notification types (success, error, warning, info, reminder)
- 📱 Responsive design
- ⏳ Auto-dismiss functionality
- 🎪 Smooth animations

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** – see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Simon Ringwelski**

- 🌐 Website: [simonringwelski.dk](https://simonringwelski.dk/)
- 🐙 GitHub: [@BlizzardWolf7](https://github.com/BlizzardWolf7/)
- 📧 Contact: [Contact form on website](https://simonringwelski.dk/)

---

## ⭐ Show Your Support

If this library helped you, please consider giving it a star! It helps others discover the project.

[![GitHub stars](https://img.shields.io/github/stars/BlizzardWolf7/toast-notification-library.svg?style=social&label=Star)](https://github.com/BlizzardWolf7/toast-notification-library)

---

*Made with ❤️ by Simon Ringwelski*
