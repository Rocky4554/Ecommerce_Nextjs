# 🛒 Next.js E-Commerce Catalog

This is a full-stack **E-Commerce Catalog Application** built using **Next.js (App Router)** and **MongoDB**.  
It demonstrates multiple rendering strategies — **SSG**, **ISR**, **SSR**, and **CSR** — across different pages.  
Users can browse and view products, while administrators can securely manage product inventory and details.

---

## 🚀 Project Overview

The goal of this project is to showcase how different **Next.js rendering methods** can be used efficiently within a single e-commerce system.

- **Home Page** → Static Site Generation (SSG)  
- **Product Details Page** → Incremental Static Regeneration (ISR)  
- **Dashboard Page** → Server-Side Rendering (SSR)  
- **Admin Panel** → Client-Side Rendering (CSR)
- **Recommendations** → Hybrid/React Server Components

The app includes a frontend built with **React + Tailwind CSS**, and a backend implemented using **Next.js API routes** connected to **MongoDB** for persistent storage.Test cases are implemented using **Jest** and **mongodb-memory-server** for in-memory database testing.

---

## ⚙️ Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the project from GitHub
git clone <your-github-repository-url>

# Navigate to project directory
cd ecommerce-app
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# OR using yarn
yarn install
```

This will install all dependencies listed in package.json including:
- Next.js framework
- React and React DOM
- MongoDB driver/Mongoose
- ImageKit SDK
- Authentication libraries
- UI component libraries

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory of your project:

```bash
# Create environment file
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.etacmzo.mongodb.net/EStore?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin Authentication
ADMIN_KEY=super-secret-admin-key
NEXT_PUBLIC_ADMIN_KEY=super-secret-admin-key
ADMIN_EMAIL=youremail@gmail.com
ADMIN_PASSWORD=yourpassword

# JWT Secret for Authentication
JWT_SECRET=supersecretkey

# ImageKit Configuration
IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
IMAGE_KIT_PUBLIC_KEY=your_public_key
IMAGE_KIT_PRIVATE_KEY=your_private_key
```

**Note:** `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used for admin login credentials.

### Step 4: MongoDB Atlas Setup

#### 4.1 Create MongoDB Atlas Account

1. Go to MongoDB Atlas
2. Click on "Try Free" or "Sign Up"
3. Complete the registration process
4. Verify your email address

#### 4.2 Create a New Cluster

1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region closest to your users
5. Name your cluster (e.g., "Cluster0")
6. Click "Create Cluster" (takes 3-5 minutes)

#### 4.3 Configure Database Access

1. In the left sidebar, click on "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create a username and strong password
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

**Important:** Save these credentials securely - you'll need them for the MongoDB URI.

#### 4.4 Configure Network Access

1. In the left sidebar, click on "Network Access"
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** For production, restrict to specific IP addresses
4. Click "Confirm"

#### 4.5 Get Your MongoDB Connection URI

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with "EStore" (or your preferred database name)

**Example Connection String:**

```
mongodb+srv://username:password@cluster0.etacmzo.mongodb.net/EStore?retryWrites=true&w=majority&appName=Cluster0
```

8. Paste this URI into your `.env.local` file as `MONGODB_URI`

### Step 5: ImageKit Setup

ImageKit is used for image storage, optimization, and delivery.

#### 5.1 Create ImageKit Account

1. Go to ImageKit.io
2. Click "Sign Up" or "Get Started Free"
3. Complete the registration process
4. Verify your email address

#### 5.2 Access Your Dashboard

1. After logging in, you'll be on the ImageKit Dashboard
2. Note your **ImageKit ID** in the URL: `https://imagekit.io/dashboard/your-imagekit-id`

#### 5.3 Get API Credentials

1. In the dashboard, click on "Developer Options" in the left sidebar
2. Navigate to "API Keys"
3. You'll see three important credentials:

**Public Key:**
- Used for client-side uploads and URL generation
- Safe to expose in frontend code
- Copy this value

**Private Key:**
- Used for server-side operations
- Must be kept secret
- Never expose in frontend code
- Click "Show" to reveal and copy this value

**URL Endpoint:**
- Your ImageKit CDN endpoint
- Format: `https://ik.imagekit.io/your-imagekit-id`
- Copy this value

#### 5.4 Add ImageKit Credentials to Environment

Update your `.env.local` file with the ImageKit credentials:

```env
IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
IMAGE_KIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
IMAGE_KIT_PRIVATE_KEY=private_xxxxxxxxxxxxx
```

#### 5.5 Configure ImageKit Settings (Optional)

1. In ImageKit dashboard, go to "Settings"
2. Configure image optimization settings:
   - Auto WebP conversion: Enabled
   - Auto quality optimization: Enabled
3. Set up media library folders for organization:
   - `/products` - Product images
   - `/banners` - Homepage banners
   - `/avatars` - User profile pictures

### Step 6: Run the Development Server

```bash
# Start the development server
npm run dev

# OR using yarn
yarn dev
```

The application will start on http://localhost:3000

### Step 7: Verify Installation

1. Open your browser and navigate to http://localhost:3000
2. You should see the homepage load successfully
3. Check the terminal for any error messages
4. Test database connection by accessing admin panel

### Step 8: Run Tests

```bash
# Run test cases
npm test
```

Test cases are implemented using **Jest** and **mongodb-memory-server** for in-memory database testing.

---

## 🗃️ Database Model (MongoDB)

Product Schema used in the application:

```js
{
  "_id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "inventory": number,
  "image": "string (URL)",
  "lastUpdated": "ISO datetime"
}
```

---

## 💡 Rendering Strategies & Reasoning

| Page | Route | Rendering Method | Why It's Used |
|------|-------|------------------|---------------|
| 🏠 Home Page | `/` | SSG (Static Site Generation) | Data doesn't change often — pre-rendering improves load time and SEO. |
| 📦 Product Detail | `/products/[slug]` | ISR (Incremental Static Regeneration) | Regenerates product pages every 60s for dynamic updates like stock or price. |
| 📊 Dashboard | `/dashboard` | SSR (Server-Side Rendering) | Requires real-time inventory updates — always serves fresh data. |
| 🔑 Admin Panel | `/admin` | CSR (Client-Side Rendering) | Enables form handling, data fetching, and dynamic interactivity securely on the client side. |
| 🎯 Recommendations | `/recommendations` | RSC (React Server Components) | Hybrid approach combining server-side data fetching with client-side interactivity. |

---

## 🧩 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/products/[slug]` | Fetch a single product |
| POST | `/api/products` | Add a new product (Admin only) |
| PUT | `/api/products/[id]` | Update an existing product (Admin only) |
| POST | `/api/admin/login` | Admin login endpoint |

All admin actions are secured with a simple key-based check using the `ADMIN_KEY` environment variable.

---

## 🧭 Data Flow Explanation

Frontend pages call backend API routes (`/api/products`, `/api/admin/...`) for data.

API routes use Mongoose to interact with the MongoDB database.

Responses are rendered differently based on the page strategy:

- SSG / ISR – Static generation or timed revalidation.
- SSR – Data fetched at request time.
- CSR – Data fetched dynamically via client-side JavaScript.

Admin routes modify the database via secured API calls.

---

## 🎨 Technologies Used

- Next.js 14 (App Router)
- React
- MongoDB + Mongoose
- Tailwind CSS
- Axios
- ImageKit (for image hosting)
- Jest + mongodb-memory-server (for testing)
- Deployed on Vercel

---

## 🧠 Why These Rendering Choices?

- **SSG** → Perfect for fast-loading, SEO-friendly, and static content like product listings.
- **ISR** → Keeps product pages updated without rebuilding the entire app.
- **SSR** → Required for secure, live, and authenticated admin dashboard data.
- **CSR** → Ideal for admin forms, data edits, and real-time UI updates.

---

## 🖼️ Screenshots

### 🏠 Home Page (SSG)
![Home Page](./public/screenshots/home-page.png)

### 📦 Product Detail Page (ISR)
![Product Detail Page](./public/screenshots/product-details.png)

### 📊 Dashboard (SSR)
![Dashboard](./public/screenshots/dashboard.png)

### 🔐 Admin Login Page
![Admin Login Page](./public/screenshots/admin-login.png)

### 🔑 Admin Panel (CSR)
![Admin Panel](./public/screenshots/admin-panel.png)

### ➕ Product Add or Edit
![Product Add or Edit](./public/screenshots/product-form.png)

### 📱 Mobile Responsive Design
![Mobile Responsive Design](./public/screenshots/mobile-responsive.png)

---

## 💭 Challenges Faced & Solutions

⚙️ **Connecting MongoDB in test mode:** Solved using mongodb-memory-server for isolated Jest tests.

🔄 **Handling multiple rendering methods:** Managed separate logic for SSG, ISR, SSR, and CSR in the App Router.

🔑 **Securing admin actions:** Implemented key-based authentication using ADMIN_KEY env variable.

🖼️ **Image uploads:** Used ImageKit integration for optimized image storage and retrieval.

---

## 🧾 Report Summary

- **Home Page:** Uses Static Site Generation (SSG) for faster performance.
- **Product Page:** Uses Incremental Static Regeneration (ISR) to auto-update product data.
- **Dashboard:** Uses Server-Side Rendering (SSR) for live stats and stock data.
- **Admin Panel:** Uses Client-Side Rendering (CSR) for dynamic form-based operations.
- **APIs:** Built under `/api/products` and `/api/admin` with MongoDB integration.
- **Testing:** Done using Jest with a mock in-memory MongoDB instance.

---

## 🧑‍💻 Author

**Raunak Kumar**

📧 Email: your.email@example.com  
🌐 GitHub: https://github.com/your-github  
📅 Date: 30 October 2025

---

⭐ If you found this helpful, don't forget to star the repo!