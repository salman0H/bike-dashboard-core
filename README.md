# 🚲 Bike Riding Web Application

A modern, full-featured administrative dashboard for managing a bike-sharing system. Built with React, TypeScript, Tailwind CSS, and JSON Server for mock API data.

## 🎯 Overview

BikeShare Admin Panel is a comprehensive dashboard for managing a bike-sharing platform. It provides administrators with tools to monitor fleet status, manage users, track financial transactions, handle alerts, and configure system settings.

## ✨ Features

### 📊 Dashboard
- Real-time KPI cards (total bikes, active bikes, revenue, system uptime)
- Interactive charts (revenue, usage, bike status, battery health)
- Critical alerts panel with scrollable list
- Responsive design with right-sidebar layout

### 👥 User Management
- View all registered users
- Search and filter users by name, phone, or status
- User status badges (active, inactive, blocked)
- Add/Edit user functionality

### 🚲 Bike & Fleet Management
- Neshan map integration for station locations
- Scrollable station list with click-to-zoom functionality
- KPI cards for fleet statistics
- Bike status tracking (available, in-use, maintenance, charging)
- Battery level indicators
- Filter bikes by status and station

### 💰 Financial Management
- Transaction history table
- Wallet balance tracking
- Revenue charts (monthly)
- Payment reports with success/failed status
- Pricing policy management

### 🔔 Alert System
- Critical alerts panel on dashboard
- Dedicated Alerts page with split-view design
- Click alerts to view detailed information
- Suggested actions for each alert
- Resolve alert functionality

### ⚙️ Settings & Permissions
- System configuration
- Profile management
- Notification preferences
- Role-based access control
- Permission toggles for different user roles

### 🗺️ Interactive Map
- Neshan map integration (Iranian mapping platform)
- Station markers with popup information
- Click station from list to zoom to location
- Dark theme map style

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **Recharts** - Advanced charts
- **Lucide React** - Icons

### Mapping
- **Neshan Maps Platform** - Iranian map service
- **Leaflet** - Map rendering

### Backend (Mock)
- **JSON Server** - Mock REST API
- **Port 3000** - API server

### Development
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bikeshare-admin.git
cd bikeshare-admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Install JSON Server globally (optional)**
```bash
npm install -g json-server
```

4. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_NESHAN_API_KEY=your_neshan_api_key_here
```

5. **Start the JSON Server (mock API)**
```bash
npm run server
# or
npx json-server --watch db.json --port 3000
```

6. **Start the React development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:5173
```

## 🚀 Running the Project

### Development Mode
```bash
# Terminal 1 - Start JSON Server
npm run server

# Terminal 2 - Start React App
npm run dev
```
### Run both servers simultaneously
```bash
npm run dev:all
```

## 🔗 API Endpoints

JSON Server runs on `http://localhost:3000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/menuItem` | GET | Sidebar navigation menu |
| `/userData` | GET | User list |
| `/stationsLocation` | GET | Bike station locations |
| `/bikesData` | GET | Fleet information |
| `/alerts` | GET | System alerts |
| `/transactions` | GET | Financial transactions |
| `/monthlyData` | GET | Monthly revenue data |
| `/notifications` | GET | Notification center |
| `/sections` | GET | Finance page sections |
| `/roles` | GET | User roles & permissions |

## 📁 Project Structure

```
BikeRidingWebApplication/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AlertCard.tsx
│   │   │   ├── BatteryHealthChart.tsx
│   │   │   ├── BikeStatusChart.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   ├── AlertCard.tsx
│   │   │   └── MapNashan.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Bikes.tsx
│   │   │   ├── Finance.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Permissions.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   └── finance/
│   │   │       ├── Policies.tsx
│   │   │       ├── PaymentReports.tsx
│   │   │       └── FinancialReports.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useData.ts
│   │   ├── styles/
│   │   │   ├── fonts.css
│   │   │   ├── index.css
│   │   │   ├── tailwind.css
│   │   │   └── theme.css
│   │   ├── routes.tsx
│   │   └── App.tsx
│   ├── db.json
│   └── main.tsx
├── db.json                       # Mock database for JSON Server
├── index.html                    # Main HTML file
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # Node TypeScript configuration
├── .gitignore                    # Git ignore rules
├── .npmrc                        # npm configuration
├── README.md                     # Project documentation
├── ATTRIBUTIONS.md               # Attribution for libraries
├── default_shadcn_theme.css      # Default shadcn theme (4.3 KB)
├── className_bg_card.txt         # Reference file (5.5 KB)
├── pnpm-workspace.yml            # pnpm workspace config
└── components.json               # shadcn/ui components config
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start React dev server (port 5173) |
| `npm run server` | Start JSON Server (port 3000) |
| `npm run dev:all` | Run both servers concurrently |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Features in Detail

### 📍 Neshan Map Integration
The map component uses Neshan (Iranian mapping platform) with:
- Custom bike station markers
- Popup with station details
- Click-to-zoom from station list
- Dark theme tiles

### 🔔 Smart Alert System
- Alerts are categorized as **Critical** or **Warning**
- Split-view design on Alerts page
- Click alert to see:
  - Bike ID and location
  - Issue description
  - Suggested actions
  - Resolution status

### 👤 User Management
- Search by name, phone, or ID
- Filter by status (active/inactive/blocked)
- Visual status indicators
- User avatar with initials

### 📊 Data Visualization
- Bar charts for revenue trends
- Line charts for usage patterns
- Donut charts for fleet distribution
- Battery health distribution# bike-dashboard-core
# bike-dashboard-core
