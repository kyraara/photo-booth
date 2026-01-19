# 📸 Photo Booth

A modern, responsive photo booth web application built with React, Vite, and Tailwind CSS.

![Photo Booth Screenshot](https://raw.githubusercontent.com/kyraara/photo-booth/main/screenshot.png)

## ✨ Features

- **📷 Camera Access** - Real-time camera preview using getUserMedia API
- **🎞️ Two Modes** - Single photo or 4-photo strip mode
- **🖼️ 12 Frames** - Classic, Polaroid, Vintage, Hearts, Stars, Birthday, Wedding, Neon, Floral, Retro, Minimal
- **🎨 8 Filters** - Normal, B&W, Sepia, Vintage, Warm, Cool, Contrast, Vivid
- **⏱️ Timer Options** - Off, 3s, 5s, 10s countdown
- **🪞 Mirror Mode** - Toggle camera mirroring
- **📱 Responsive** - Works on desktop and mobile devices
- **💾 Download** - Save photos as PNG

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kyraara/photo-booth.git

# Navigate to project directory
cd photo-booth

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Canvas API** - Photo capture & processing

## 📁 Project Structure

```
src/
├── components/
│   ├── Camera.jsx          # Camera preview
│   ├── CameraSettings.jsx  # Settings panel
│   ├── Countdown.jsx       # Timer animation
│   ├── FilterSelector.jsx  # Filter options
│   ├── FrameSelector.jsx   # Frame options
│   ├── ModeSelector.jsx    # Single/Strip toggle
│   ├── PhotoPreview.jsx    # Photo result modal
│   └── StripPreview.jsx    # Strip result modal
├── App.jsx                 # Main app
├── index.css               # Styles
└── main.jsx                # Entry point
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ by [kyraara](https://github.com/kyraara)
