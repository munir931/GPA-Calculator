# 🎓 HEC-Aligned GPA & CGPA Calculator

![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare_Pages-orange?style=flat-square&logo=cloudflare)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=flat-square)

A high-performance, mobile-responsive GPA calculation engine specifically designed for the Pakistani academic landscape. This tool provides instant, accurate results based on the **Higher Education Commission (HEC)** grading standards.

## 🚀 Live Demo
**[Click Here to Calculate Your GPA](https://your-subdomain.pages.dev)** *(Replace this link with your actual Cloudflare Pages URL once deployed)*

---

## 🛠 Features
- **Instant Computation:** Real-time GPA/CGPA calculation as you type.
- **HEC Standardized:** Default presets for the 4.0 grading scale used across Pakistani universities (NUST, UET, UST Bannu, etc.).
- **Cloudflare Optimized:** Hosted on the Edge to ensure sub-100ms latency for users in Pakistan.
- **PWA Ready:** Lightweight architecture that works smoothly on mobile browsers.
- **AI-Ready Metadata:** Includes `llms.txt` for discovery by AI agents and search engines.

## 🏗 Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Modern Flexbox/Grid), JavaScript (ES6+).
- **Deployment:** Cloudflare Pages (CI/CD via GitHub Actions).
- **Performance:** Cloudflare Rocket Loader & Polish for image/script optimization.

## 📂 Project Structure
```text
├── index.html      # Main UI and SEO Meta Tags
├── style.css       # Responsive design and branding
├── script.js      # Core calculation logic
├── llms.txt        # AI Crawler instructions
└── README.md       # Project documentation