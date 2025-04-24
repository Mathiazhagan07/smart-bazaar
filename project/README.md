# Smart Bazaar: Empowering Local Vendors

Smart Bazaar is a community-focused web application built to help local vendors and small shopkeepers gain visibility, manage their shops, and connect with nearby customers using modern web technologies.

## 🌟 Features

- Vendor registration and login (Firebase Authentication)
- Vendor shop setup and inventory listing (Firestore)
- Location marking and search via Google Maps API
- Customer view to discover vendors near them
- Simple UI for both vendors and customers

## 🧰 Tech Stack

- React with TypeScript
- Firebase (Authentication, Firestore)
- Google Maps API
- Tailwind CSS for styling
- Vite for development and building

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key

### Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/smart-bazaar.git
cd smart-bazaar
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

- Enable Authentication (Email/Password)
- Create a Firestore database
- Get your Firebase configuration

Update the Firebase configuration in `src/firebase.ts` with your own credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Configure Google Maps

Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)

Update the API key in `src/pages/CustomerMap.tsx`:

```typescript
const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
});
```

5. Start the development server
```bash
npm run dev
```

## 📱 Application Structure

- `/src/components` - Reusable UI components
- `/src/contexts` - React context providers
- `/src/pages` - Main application pages
- `/src/types.ts` - TypeScript interfaces
- `/src/firebase.ts` - Firebase configuration

## 📸 Screenshots

> Add screenshots of app screens once implemented

## 📈 Future Enhancements

- Digital payments integration
- Order management system
- Customer reviews and ratings
- Advanced inventory management
- Multi-language support
- Mobile app using React Native

## 🧑‍💻 Author

- Your Name - [@yourGitHub](https://github.com/yourGitHub)

## 🔗 License

This project is licensed under the MIT License.