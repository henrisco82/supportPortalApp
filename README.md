# Support Portal Application

A modern, full-featured user management system built with Angular 18 and Spring Boot. This application provides comprehensive user administration capabilities with JWT authentication, file upload functionality, and responsive design.

## 🚀 Features

### Core Functionality
- **🔐 JWT Authentication** - Secure login and registration system
- **👥 User Management** - Complete CRUD operations for user accounts
- **📁 File Upload** - Profile image upload with progress tracking
- **🛡️ Role-Based Access** - User and admin role management
- **📱 Responsive Design** - Mobile-first Bootstrap 5 interface
- **🔔 Toast Notifications** - Real-time feedback for all operations

### User Features
- User registration and login
- Profile management with image upload
- Account status management (active/inactive, locked/unlocked)
- Role assignment (USER, ADMIN, etc.)
- Password reset functionality
- Account deletion and restoration

### Admin Features
- View all users with pagination
- Search and filter users
- Manage user roles and permissions
- Activate/deactivate user accounts
- Lock/unlock user accounts
- Delete and restore user accounts

## 🛠️ Technology Stack

### Frontend
- **Angular 18.2.14** - Latest Angular framework
- **TypeScript 5.4.5** - Type-safe JavaScript
- **RxJS 7.8.1** - Reactive programming
- **Bootstrap 5.3.3** - Responsive CSS framework
- **FontAwesome 6.5.2** - Icon library
- **ngx-toastr 18.0.0** - Toast notifications

### Backend (External)
- **Spring Boot** - REST API backend
- **JWT Authentication** - Token-based security
- **MySQL/PostgreSQL** - Database (configured externally)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js 18+** (Latest LTS recommended)
- **npm 8+** or **yarn**
- **Angular CLI 18+**
- **Spring Boot Backend** (separate repository)

```bash
# Check versions
node --version     # Should be 18+
npm --version      # Should be 8+
ng version         # Should be 18+
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd supportPortApp
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Fix npm Permissions (if needed)
```bash
sudo chown -R $(whoami) ~/.npm
```

### 4. Configure Environment
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'  // Your Spring Boot API URL
};
```

### 5. Start Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
ng build --configuration=production
```

### Build Artifacts
Production builds are stored in the `dist/supportPortApp/` directory.

## 🏛️ Project Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── login/          # Login component
│   │   ├── register/       # Registration component
│   │   ├── user/           # User management component
│   │   └── nav/            # Navigation component
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts   # Authentication guard
│   ├── model/              # Data models
│   │   ├── user.ts         # User model
│   │   └── custom-http-response.ts
│   ├── service/            # Business logic services
│   │   ├── auth.service.ts # Authentication service
│   │   ├── user.service.ts # User management service
│   │   └── notification.service.ts
│   ├── enum/               # TypeScript enums
│   │   ├── role.enum.ts    # User roles
│   │   └── notification-type.enum.ts
│   ├── notification.module.ts # Toast notifications module
│   └── app-routing.module.ts   # Application routes
├── environments/           # Environment configurations
├── assets/                 # Static assets
└── styles.css             # Global styles
```

## 🔗 API Integration

This Angular frontend connects to a Spring Boot backend API. The backend should provide:

### Authentication Endpoints
- `POST /user/login` - User login
- `POST /user/register` - User registration

### User Management Endpoints
- `GET /user/list` - Get all users (paginated)
- `GET /user/search/{username}` - Search users
- `POST /user/add` - Add new user
- `PUT /user/update` - Update user
- `DELETE /user/delete/{id}` - Delete user
- `PUT /user/resetpassword` - Reset password

### File Upload Endpoints
- `POST /user/photo/upload` - Upload profile image
- `GET /user/photo/{filename}` - Get profile image

## 🔐 Security Features

- **JWT Token Authentication** - Secure API communication
- **HTTP Interceptors** - Automatic token attachment
- **Route Guards** - Protected routes
- **CORS Configuration** - Cross-origin requests
- **Role-based Access Control** - User permissions

## 🎨 UI/UX Features

- **Responsive Design** - Works on all screen sizes
- **Bootstrap 5 Components** - Modern UI elements
- **FontAwesome Icons** - Consistent iconography
- **Loading Indicators** - User feedback during operations
- **Toast Notifications** - Success/error messaging
- **Progress Bars** - File upload progress
- **Modal Dialogs** - User interactions

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run e2e
```

## 📊 Development Workflow

### Code Quality
- **TypeScript Strict Mode** - Type safety
- **Linting** - Code quality checks
- **Prettier** - Code formatting
- **Git Hooks** - Pre-commit checks

### Branching Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches

## 🚀 Recent Updates

### Angular 18 Migration (Latest)
- ✅ Upgraded from Angular 12 to 18.2.14
- ✅ Updated all dependencies to latest versions
- ✅ Fixed FontAwesome compatibility issues
- ✅ Replaced angular-notifier with ngx-toastr
- ✅ Updated TypeScript to 5.4.5
- ✅ Modernized RxJS to version 7.8.1
- ✅ Enhanced security and performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Version History

- **v2.0.0** - Angular 18 migration, modern UI, enhanced security
- **v1.0.0** - Initial release with basic user management

---

**Built with ❤️ using Angular 18**
