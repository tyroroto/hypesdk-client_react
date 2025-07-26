# HypeSDK Client React Development Guidelines

## Project Overview

HypeSDK Client React is a frontend application that serves as a client for the [HypeSDK-API](https://github.com/gwingwin-cc/hypesdk-api). It provides a UI interface for controlling the API instead of making direct API calls, and is designed to be extendable and customizable for workflows and data integration.

## Build and Configuration

### Prerequisites

- Node.js (compatible with the dependencies in package.json)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/gwingwin-cc/hypesdk-client_react.git

# Navigate to the project directory
cd hypesdk-client_react

# Install dependencies
yarn
```

### Development

```bash
# Start the development server
yarn dev
```

### Production Build

```bash
# Build for production
yarn build

# Preview the production build
yarn preview
```

### Environment Variables

The application uses environment variables for configuration, which can be set in two ways:

1. **Vite Environment Variables**: Create `.env`, `.env.local`, `.env.development`, or `.env.production` files in the project root with variables prefixed with `VITE_`. These will be automatically exposed by Vite.

2. **Runtime Injection**: Environment variables can also be injected into the `window['env']` object at runtime, which will be merged with the Vite environment variables.

## Project Structure

### Core Directories

- **src/**: Main source code
  - **assets/**: Static assets (images, fonts, etc.)
  - **hype/**: Core HypeSDK client functionality
    - **app-components/**: Application-specific components
    - **classes/**: Class definitions and constants
    - **components/**: Reusable UI components
    - **contexts/**: React contexts for state management
    - **form-components/**: Form-specific components
    - **share-components/**: Shared components
  - **layouts/**: Layout components
  - **libs/**: Utility libraries and helpers
  - **pages/**: Page components for different routes
  - **scss/**: SCSS stylesheets
  - **stores/**: State management (using Zustand)

### Key Files

- **src/main.tsx**: Application entry point
- **src/Router.tsx**: Routing configuration
- **src/App.tsx**: Main App component
- **src/env.ts**: Environment variable handling

## Development Patterns

### Component Structure

- Functional components with TypeScript interfaces for props
- React hooks for state management and side effects
- Memoization with useMemo for performance optimization

### State Management

- **API Queries**: Uses react-query for data fetching, caching, and state management
- **Global State**: Uses Zustand for global state management
- **Context API**: Uses React Context for cross-cutting concerns like authentication and permissions

### Routing

- Uses react-router-dom with a hierarchical route structure
- Different routes for development vs production environments
- Different form modes (PREVIEW vs NORMAL) and layouts (DRAFT vs ACTIVE)

### Authorization

- Uses @casl/ability for permission management
- Role-based access control with permissions and roles management

### UI Components

- Uses react-bootstrap and reactstrap for UI components
- Uses react-feather for icons
- Custom components for specific functionality

### Form Handling

- Uses react-hook-form for form state management
- Custom form components for specific input types
- Support for different form modes and layouts

## Application Features

- **User Management**: Create, update, and manage users
- **Form Management**: Create, update, and manage forms
- **Record Management**: Create, update, and manage form records
- **Script Management**: Create, update, and manage scripts
- **Role and Permissions Management**: Manage roles and permissions for users

## Code Style and Conventions

- TypeScript for type safety
- ESLint for code linting
- Functional components with hooks
- Strong typing with interfaces and types
- Component-based architecture
- Separation of concerns between UI components and data fetching

## Troubleshooting

- If you encounter issues with dependencies, try clearing the yarn cache and reinstalling:
  ```bash
  yarn cache clean
  yarn
  ```

- For issues with the development server, check the Vite configuration and ensure all required environment variables are set.

- For TypeScript errors, ensure your TypeScript version matches the one specified in package.json.