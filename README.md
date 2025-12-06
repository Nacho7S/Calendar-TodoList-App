# NACALENDAR - Next.js Calendar Application

NACALENDAR is a full-stack Next.js application with calendar functionality, user authentication, and theme customization. Built with Next.js 16, React, TypeScript, and MongoDB, this app provides a complete calendar solution with event management, user registration/login, and preference settings.

## 🚀 Features

### Authentication & User Management
- **User Registration**: Create accounts with username, email, and password
- **Secure Login**: JWT-based authentication with encrypted password storage
- **Protected Routes**: Middleware to protect sensitive pages
- **Session Management**: HTTP-only cookies for secure token storage

### Calendar Functionality
- **Event Management**: Create, read, update, and delete calendar events
- **Event Types**: Support for different event types (meetings, tasks, events, reminders)
- **Date Range Queries**: Fetch events within specific date ranges
- **Event Completion**: Toggle event status as done/not done
- **Time Management**: Set start/end times for events

### User Experience
- **Theme Customization**: Multiple theme options (light, dark, oled, red, pink)
- **Language Support**: Multi-language interface (en, ja, es, id, zh, ko, de, fr)
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean, intuitive user interface with gradient accents

## 🛠️ Tech Stack

### Frontend
- **Next.js** 16.0.5 (App Router)
- **React** 19.2.0
- **TypeScript** with React type definitions
- **Tailwind CSS** for styling
- **Client-Side State Management** with custom hooks

### Backend
- **Next.js API Routes** for backend endpoints
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **jose** for JWT handling

### Additional Tools
- **ESLint** for code linting
- **Next Font** for optimized font loading (Geist)
- **Middleware** for route protection

## 📁 Project Structure

```
app/
├── api/                 # Next.js API routes
│   ├── auth/           # Authentication endpoints
│   │   ├── login/      # User login
│   │   ├── register/   # User registration
│   │   └── me/         # User data retrieval
│   ├── calendar/       # Calendar event endpoints
│   └── user/           # User preference endpoints
├── components/         # Reusable UI components
├── controllers/        # Backend logic controllers
├── models/             # MongoDB models
├── providers/          # React context providers
├── home/              # Home page
├── login/             # Login page
├── register/          # Registration page
├── profile/           # Profile page
├── settings/          # Settings page
└── lib/               # Helper libraries
```

## 🏗️ Backend API Endpoints

### Authentication API
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/register` - User registration with password hashing
- `GET /api/auth/me` - Get current user data

### Calendar API
- `GET /api/calendar` - Get all calendar events for user
- `GET /api/calendar?id={id}` - Get specific event by ID
- `GET /api/calendar?startDate={date}&endDate={date}` - Get events in date range
- `POST /api/calendar` - Create a new calendar event
- `PUT /api/calendar?id={id}` - Update a calendar event
- `PUT /api/calendar?id={id}` - Toggle event completion status
- `DELETE /api/calendar?id={id}` - Delete a calendar event

### User API
- `PUT /api/user/preferences` - Update user preferences (theme, language)

## 📊 Database Models

### User Model
- `_id`: ObjectId (auto-generated)
- `username`: String (unique, 3-30 characters)
- `password`: String (hashed)
- `email`: String (unique)
- `theme`: String (default: "light")
- `language`: String (default: "en")
- `createdAt`, `updatedAt`: Timestamps

### Calendar Event Model
- `_id`: ObjectId (auto-generated)
- `userId`: ObjectId (reference to User)
- `date`: Date (start date)
- `endDate`: Date (end date)
- `description`: String (optional)
- `timeDue`: String (in HH:MM format)
- `timestart`: String (in HH:MM format)
- `title`: String (required)
- `type`: String (enum: 'meet', 'task', 'event', 'reminder')
- `isEventDone`: Boolean (default: false)
- `createdAt`, `updatedAt`: Timestamps

## 🔐 Authentication & Authorization

### Middleware Protection
The application uses Next.js middleware to protect routes:
- **Protected routes**: `/home`
- **Public routes**: `/login`, `/register`
- **Automatic redirects** based on authentication status

### JWT Token Flow
1. User logs in with credentials
2. Server verifies credentials and generates JWT
3. JWT stored in HTTP-only cookie
4. Cookie sent with each request to protected endpoints
5. Middleware validates token before granting access

### Password Security
- Passwords are hashed using bcrypt before storage
- Minimum password length of 6 characters enforced

## 🎨 Theme & Language Support

### Themes Available
- Light (default)
- Dark
- OLED (pure black background)
- Red
- Pink

### Languages Supported
- English (en)
- Japanese (ja)
- Spanish (es)
- Indonesian (id)
- Chinese (zh)
- Korean (ko)
- German (de)
- French (fr)

## 🔧 Environment Setup

### Prerequisites
- Node.js 18+ (recommended)
- MongoDB (local or cloud instance)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd uts
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/uts_calendar
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXT_PUBLIC_APP_NAME=NACALENDAR
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Other Platforms
This is a standard Next.js application, so it can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps
- Docker containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- None currently reported

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Icons and assets from [Various Sources]
- Inspired by modern calendar applications

---
*This README was generated to provide comprehensive documentation for both the backend API and frontend components of the NACALENDAR application.*