# Firebase E-Commerce Platform

A full-stack e-commerce platform built with Next.js, Firebase, and Tailwind CSS featuring dynamic pricing, search functionality, and admin management.

## Features

- **User Authentication**: Firebase Auth with email/password
- **Dynamic Pricing**: Prices adjust based on user visit count
- **Search & Filtering**: Advanced product search with category and price filters
- **Admin Dashboard**: Complete CRUD operations for products and categories
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Database**: Firestore for all data storage
- **Security Rules**: Proper Firestore security rules for data protection

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase account
- Firebase CLI installed globally

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your Firebase project:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Hosting

4. Configure environment variables:
   Create a `.env.local` file with your Firebase config:
   \`\`\`
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

5. Deploy Firestore rules:
   \`\`\`bash
   firebase deploy --only firestore:rules
   \`\`\`

6. Seed the database:
   \`\`\`bash
   node scripts/seed-data.js
   \`\`\`

7. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Creating an Admin User

1. Register a new user through the application
2. Go to Firebase Console > Firestore Database
3. Find the user document in the `users` collection
4. Add `isAdmin: true` field to make them an admin

## Database Schema

### Collections

- **users**: `{ id, name, email, isAdmin }`
- **categories**: `{ id, name }`
- **products**: `{ id, name, description, imageUrl, categoryId, basePrice, stock, visitCount }`
- **visits**: `{ userId, productId, visitCount }`

## Dynamic Pricing

The platform implements dynamic pricing based on user behavior:
- Formula: `adjustedPrice = basePrice + (visitCount × 0.5)`
- Tracks visits for both authenticated and guest users
- Guest visits stored in localStorage
- Authenticated user visits stored in Firestore

## Deployment

### Firebase Hosting

1. Build the application:
   \`\`\`bash
   npm run build
   npm run export
   \`\`\`

2. Deploy to Firebase:
   \`\`\`bash
   firebase deploy
   \`\`\`

## Security

The application implements proper Firestore security rules:
- Users can only read/write their own data
- Admin-only write access for products and categories
- Public read access for products and categories
- Visit tracking restricted to data owners

## Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
