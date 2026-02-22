# 🎨 LexAI – Frontend Interface

Welcome to the face of **LexAI**. This is the user-friendly portal where Canadan citizens and lawyers connect. It is built with **React** and **Tailwind CSS** to be fast, beautiful, and easy to use on any device.

---

## 🚀 Getting Started

To run the frontend on your local machine, please follow these steps:

### 1️⃣ Setup the Environment

The frontend needs to know how to talk to the backend and Clerk for security.

- Get the `.env` file from the project leader
- Paste it into the `lexai-frontend` root folder
- This file contains your **Clerk Publishable Key** so the login buttons work

---

### 2️⃣ Install Dependencies

Open your terminal in the frontend folder and run:
```bash
npm install
```

This installs React, Lucide-React icons, and the Clerk auth tools.

---

### 3️⃣ Change the Tab Icon (Favicon)

To make the project look professional, we replaced the Vite logo with our own:

- Move your `logo.png` to the `public/` folder
- Rename it to `favicon.png`
- Update the code in `index.html` to `<link rel="icon" href="/favicon.png" />`

---

## 📂 Project Structure

- **📂 src/assets**: Stores our branding images like `logo.png`
- **📂 src/components**: Reusable parts like our Navbar and Footer
- **📂 src/pages**: Main screens like Home, About, and Find Lawyer
- **📂 src/admin**: The Admin Dashboard with real-time charts from Stripe and Clerk

---

## 🛠️ Key Features

| Feature | Description |
|---------|-------------|
| Smart Navbar | Shows "Admin" or "Lawyer" links only if you have that role |
| Admin Dashboard | Real-time charts for Revenue (Stripe) and User Growth (Clerk) |
| Knowledge Base | Admin can upload/delete PDFs. Deleting a file cleans the DB and the UI |
| Responsive Design | Works perfectly on mobile phones and laptops using Tailwind CSS |

---

## 🎨 Branding & UI

- **Logo**: Custom LexAI logo used in both Navbar and Footer
- **Icons**: Powered by Lucide-React for a clean, modern look
- **Colors**: Professional Slate-900 and Blue-600 theme

---

## ⚡ How to Run

To start the development server, run:
```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📝 Notes

- Make sure the backend is running on `http://localhost:5000` before starting the frontend
- Keep your `.env` file secure and never commit it to version control
- For issues or questions, contact the project lead

---

**Built with ❤️ for accessible legal information in Canada**
