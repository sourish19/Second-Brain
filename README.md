# Second Brain

A modern, full-stack content management application that helps you organize and manage your digital content in one place. Built with React, TypeScript, and Express, Second Brain allows you to save, categorize, and share your favorite links, documents, videos, and more.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Google OAuth 2.0 integration
  - Secure session management with HTTP-only cookies
  
- **Content Management**
  - Add, view, and delete content items
  - Support for multiple content types: documents, tweets, videos, links, and more
  - Tag-based organization (up to 3 tags per item)
  - Auto-generated preview images for links
  
- **Sharing**
  - Generate shareable links for your content
  - Share your curated collections with others
  
- **Modern UI/UX**
  - Clean, responsive design with TailwindCSS
  - Dark mode support
  - Smooth animations and transitions
  - Built with Radix UI components for accessibility

- **Performance & Security**
  - Rate limiting to prevent abuse
  - Redis caching for improved performance
  - Helmet.js for security headers
  - CORS configuration
  - Input validation with Zod

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: TanStack Form
- **Styling**: TailwindCSS 4.0 with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Validation**: Zod
- **Code Quality**: Biome (linting & formatting)

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Caching**: Redis (ioredis)
- **Authentication**: Passport.js (Local & Google OAuth)
- **Security**: Helmet, CORS, bcrypt
- **Rate Limiting**: express-rate-limit
- **Logging**: Pino
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Redis (optional, for caching)
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SecondBrain
   ```

2. **Install dependencies**

   For the client:
   ```bash
   cd client
   npm install
   ```

   For the server:
   ```bash
   cd server
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory with the following variables:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/secondbrain

   # Redis (optional)
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/users/google/callback

   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Available Scripts

### Client

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run lint` - Lint code with Biome
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome checks and auto-fix

### Server

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run format` - Format code with Prettier

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/getme` - Get current user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/google` - Initiate Google OAuth
- `GET /api/v1/users/google/callback` - Google OAuth callback

### Content Management
- `POST /api/v1/add-content` - Add new content
- `GET /api/v1/get-contents` - Get all user contents
- `DELETE /api/v1/delete-content` - Delete content by ID
- `POST /api/v1/share` - Generate shareable link
- `GET /api/v1/share/:contentToken` - Get shared contents

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password encryption
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Zod schemas for request validation
- **HTTP-only Cookies**: Secure session management

## UI Components

The application uses a custom component library built on top of Radix UI:
- Dialog/Sheet for modals
- Dropdown menus
- Select inputs
- Form fields with validation
- Buttons with variants
- Loading spinners
- Toast notifications

## Testing

The project includes testing setup with:
- **Vitest** for unit and integration tests
- **Testing Library** for React component testing
- **jsdom** for DOM simulation

Run tests:
```bash
cd client
npm run test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Sourish**

## Acknowledgments

- Built with modern web technologies
- Inspired by note-taking and content curation apps
- UI components from Radix UI
- Icons from Lucide React

---

**Happy organizing!**
