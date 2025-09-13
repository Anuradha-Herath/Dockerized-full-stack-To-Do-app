# 📝 TodoMaster - Complete Task Management Application

A modern, full-stack to-do application built with React, Node.js, Express, and MongoDB. Features a clean, minimal design with dark/light mode support, user authentication, and comprehensive task management capabilities.

![TodoMaster Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=TodoMaster+App)

## 🎨 Design Features

### Theme & Color Palette
- **Style**: Modern, minimal, calming interface
- **Primary Color**: Indigo 600 (#4F46E5) - buttons, highlights, links
- **Secondary Color**: Emerald 500 (#10B981) - success states, completed tasks
- **Warning Color**: Amber 500 (#F59E0B) - pending or medium priority
- **Typography**: Inter and Poppins fonts
- **Rounded corners** with soft shadows (12px border-radius)
- **Smooth animations** for adding/completing tasks
- **Light & Dark mode** support with smooth transitions

### Visual Elements
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and buttons
- Color-coded priority tags (red = urgent, yellow = medium, green = low)
- Progress bars with motivational messages
- Custom scrollbars matching the theme
- Responsive design with mobile-first approach

## ✨ Features

### 🔐 Authentication
- **Login/Sign Up Page** with elegant form design
- Password visibility toggle
- Form validation with error handling
- Demo mode for easy testing
- Persistent login sessions

### 📊 Dashboard
- **Clean header** with app logo and user info
- **Progress bar** showing completion percentage with motivational messages
- **Quick add task** input at the top
- **Statistics cards** showing:
  - Total tasks
  - Completed tasks
  - Today's tasks
  - Overdue tasks
- **Task filtering** (All, Today, This Week, Completed)
- **Mobile responsive** with bottom navigation

### 🎯 Task Management
- **Create, Read, Update, Delete** tasks
- **Task priorities** (High, Medium, Low) with color coding
- **Due dates** with calendar picker
- **Task descriptions** with rich text support
- **Completion tracking** with smooth animations
- **Bulk operations** and filtering

### 📱 Task Details Modal
- Full task description editing
- Priority selector with colored pills
- Deadline picker with date validation
- Edit & delete actions with confirmation dialogs

### 👤 Profile & Settings
- **User profile card** with avatar
- **Dark mode toggle** with system preference detection
- **Notification preferences**:
  - Email updates for task reminders
  - Browser push notifications
  - Weekly progress digest
- **Password change** functionality
- **Data export** (JSON format)
- **Account deletion** with confirmation

### 📱 Mobile Features
- **Bottom navigation bar** for mobile devices
- **Touch-friendly** interface with larger tap targets
- **Swipe gestures** for task actions
- **Responsive typography** and spacing

## 🛠 Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date manipulation
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** runtime
- **Express.js** web framework
- **MongoDB** database with Mongoose ODM
- **CORS** for cross-origin requests
- **JSON** data handling

### Development Tools
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **Autoprefixer** for browser compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-application
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

6. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:3000

## 📱 Usage

### Getting Started
1. **Access the Application**: Navigate to http://localhost:3000
2. **Create an Account**: Use the sign-up form (demo mode accepts any email/password)
3. **Start Adding Tasks**: Use the quick add input or detailed task modal
4. **Organize Tasks**: Set priorities, due dates, and descriptions
5. **Track Progress**: Monitor your completion rate on the dashboard
6. **Customize Settings**: Toggle dark mode and configure notifications

### Task Management Workflow
1. **Create Tasks**: Add tasks with titles, descriptions, priorities, and due dates
2. **Organize**: Use filters to view tasks by status or date
3. **Track Progress**: Mark tasks as complete with satisfying animations
4. **Analyze**: View statistics and progress indicators
5. **Maintain**: Edit, update, or delete tasks as needed

## 🎯 Key Features Breakdown

### Smart Filtering
- **All Tasks**: Complete overview
- **Today**: Focus on immediate priorities
- **This Week**: Weekly planning view
- **Completed**: Achievement tracking

### Progress Tracking
- Real-time completion percentage
- Motivational messages based on progress
- Visual progress indicators
- Daily/weekly statistics

### User Experience
- **Smooth Animations**: Fade, slide, and scale effects
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure
```
todo-application/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Main application pages
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API URL

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database service
2. Configure environment variables
3. Deploy to Heroku, DigitalOcean, or your preferred platform

## 🐳 Docker Support

The application includes Docker support for easy deployment:

### Quick Start with Docker
```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Development with Docker
```bash
# Start in development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **MongoDB** for the flexible database solution

## 📞 Support

If you have any questions or need help with setup, please open an issue in the repository or contact the development team.

---

**Built with ❤️ by the TodoMaster Team**
