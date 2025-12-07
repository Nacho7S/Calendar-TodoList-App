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

#### Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "user@example.com",
    "password": "strongpassword"
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "user@example.com"
    }
  }
  ```

#### Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword"
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "user@example.com",
      "theme": "light",
      "language": "en"
    }
  }
  ```
- **Note**: Token will be stored in HTTP-only cookie `auth-token`

#### Logout User
- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Headers**: None required
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
- **Note**: Cookie `auth-token` will be deleted

#### Get Current User Info
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "user@example.com",
      "theme": "light",
      "language": "en"
    }
  }
  ```

### Calendar API

#### Get All Calendar Events
- **Method**: `GET`
- **URL**: `/api/calendar`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "events": [
      {
        "id": "event_id",
        "userId": "user_id",
        "title": "Event Title",
        "description": "Event Description",
        "date": "2023-12-25T00:00:00.000Z",
        "endDate": "2023-12-25T00:00:00.000Z",
        "timeDue": "10:00",
        "timestart": "09:00",
        "type": "event",
        "isEventDone": false,
        "createdAt": "2023-12-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get Calendar Event by ID
- **Method**: `GET`
- **URL**: `/api/calendar?id=event_id`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "event": {
      "id": "event_id",
      "userId": "user_id",
      "title": "Event Title",
      "description": "Event Description",
      "date": "2023-12-25T00:00:00.000Z",
      "endDate": "2023-12-25T00:00:00.000Z",
      "timeDue": "10:00",
      "timestart": "09:00",
      "type": "event",
      "isEventDone": false,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  }
  ```

#### Get Calendar Events by Date Range
- **Method**: `GET`
- **URL**: `/api/calendar?startDate=2023-01-01&endDate=2023-12-31`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "events": [
      {
        "id": "event_id",
        "userId": "user_id",
        "title": "Event Title",
        "description": "Event Description",
        "date": "2023-12-25T00:00:00.000Z",
        "endDate": "2023-12-25T00:00:00.000Z",
        "timeDue": "10:00",
        "timestart": "09:00",
        "type": "event",
        "isEventDone": false,
        "createdAt": "2023-12-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Create Calendar Event
- **Method**: `POST`
- **URL**: `/api/calendar`
- **Headers**:
  - `Content-Type: application/json`
  - Cookie with `auth-token`
- **Body**:
  ```json
  {
    "title": "New Event",
    "description": "Event Description",
    "date": "2023-12-25T00:00:00.000Z",
    "endDate": "2023-12-25T00:00:00.000Z",
    "timeDue": "17:00",
    "timestart": "09:00",
    "type": "event"
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Event created successfully",
    "event": {
      "id": "event_id",
      "userId": "user_id",
      "title": "New Event",
      "description": "Event Description",
      "date": "2023-12-25T00:00:00.000Z",
      "endDate": "2023-12-25T00:00:00.000Z",
      "timeDue": "17:00",
      "timestart": "09:00",
      "type": "event",
      "isEventDone": false,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  }
  ```

#### Update Calendar Event
- **Method**: `PUT`
- **URL**: `/api/calendar?id=event_id`
- **Headers**:
  - `Content-Type: application/json`
  - Cookie with `auth-token`
- **Body**:
  ```json
  {
    "title": "Updated Event",
    "description": "Updated Description",
    "date": "2023-12-26T00:00:00.000Z",
    "endDate": "2023-12-26T00:00:00.000Z",
    "timeDue": "18:00",
    "timestart": "10:00",
    "type": "task",
    "isEventDone": true
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Event updated successfully",
    "event": {
      "id": "event_id",
      "userId": "user_id",
      "title": "Updated Event",
      "description": "Updated Description",
      "date": "2023-12-26T00:00:00.000Z",
      "endDate": "2023-12-26T00:00:00.000Z",
      "timeDue": "18:00",
      "timestart": "10:00",
      "type": "task",
      "isEventDone": true,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  }
  ```

#### Toggle Event Done Status
- **Method**: `PUT`
- **URL**: `/api/calendar?id=event_id`
- **Headers**:
  - `Content-Type: application/json`
  - Cookie with `auth-token`
- **Body**:
  ```json
  {
    "isEventDone": true
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Event status updated successfully",
    "event": {
      "id": "event_id",
      "title": "Event Title",
      "isEventDone": true
    }
  }
  ```

#### Delete Calendar Event
- **Method**: `DELETE`
- **URL**: `/api/calendar?id=event_id`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Event deleted successfully"
  }
  ```

### User API

#### Change Password
- **Method**: `PUT`
- **URL**: `/api/user/change-password`
- **Headers**:
  - `Content-Type: application/json`
  - Cookie with `auth-token`
- **Body**:
  ```json
  {
    "currentPassword": "current_password",
    "newPassword": "new_strong_password",
    "confirmNewPassword": "new_strong_password"
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

#### Update User Preferences
- **Method**: `PUT`
- **URL**: `/api/user/preferences`
- **Headers**:
  - `Content-Type: application/json`
  - Cookie with `auth-token`
- **Body**:
  ```json
  {
    "theme": "dark",
    "language": "en",
    "notifications": true
  }
  ```
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Preferences updated successfully",
    "preferences": {
      "theme": "dark",
      "language": "en",
      "notifications": true
    }
  }
  ```

#### Delete User Account
- **Method**: `DELETE`
- **URL**: `/api/user/delete-account`
- **Headers**: Cookie with `auth-token`
- **Response Success**:
  ```json
  {
    "success": true,
    "message": "Account deleted successfully"
  }
  ```
- **Note**: Cookie `auth-token` will be deleted after account deletion

### General Notes:
- All endpoints requiring authentication need the `auth-token` cookie obtained after login
- If no token is provided or token is invalid, endpoints will respond with status 401 (Unauthorized)
- Error response format:
  ```json
  {
    "success": false,
    "message": "Error description here",
    "error": "Error details"
  }
  ```

## 📊 Database Models

### User Model
- `_id`: ObjectId (auto-generated)
- `username`: String (required, unique, 3-30 characters, trimmed)
- `password`: String (required, min length: 6)
- `email`: String (required, unique, trimmed, lowercase)
- `theme`: String (default: "light")
- `language`: String (default: "en")
- `createdAt`, `updatedAt`: Timestamps

### Calendar Event Model
- `_id`: ObjectId (auto-generated)
- `userId`: ObjectId (required, reference to User)
- `date`: Date (required)
- `description`: String (optional, default: "")
- `endDate`: Date (required)
- `timeDue`: String (required, format: "HH:MM")
- `timestart`: String (required, format: "HH:MM")
- `title`: String (required)
- `type`: String (required, enum: 'meet', 'task', 'event', 'reminder')
- `isEventDone`: Boolean (required, default: false)
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
   git clone https://github.com/Nacho7S/Calendar-TodoList-App.git
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
   MONGODB_URI=
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=
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


## 🐛 Known Issues

- None currently reported


## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Icons and assets from [Various Sources]
- Inspired by modern calendar applications

---
