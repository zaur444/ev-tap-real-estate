# Firebase Setup Guide for EV Tap Real Estate App

## 🚀 Quick Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ev-tap-real-estate` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Add your project support email → Save

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

### 4. Enable Storage

1. Go to **Storage** → **Get started**
2. Choose **Start in test mode** (for development)
3. Select a location (same as Firestore)
4. Click "Done"

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`) to add a web app
4. Enter app nickname: `ev-tap-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

### 6. Update Your App Configuration

1. Open `src/firebase/config.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-actual-measurement-id"
};
```

### 7. Set Up Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection - readable by all, writable by authenticated users
    match /properties/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users collection - users can only access their own data
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Favorites collection - users can only access their own favorites
    match /favorites/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Views collection - readable by all, writable by authenticated users
    match /views/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 8. Set Up Storage Security Rules

1. Go to **Storage** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Property images - readable by all, writable by authenticated users
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User avatars - readable by all, writable by the user
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔧 Optional: Add Sample Data

### Add Sample Properties to Firestore

You can add the sample properties from your app to Firestore:

1. Go to **Firestore Database** → **Data**
2. Click "Start collection"
3. Collection ID: `properties`
4. Add documents with the sample property data from your `MOCK_PROPERTIES` array

### Enable Real-time Data

The app is already configured to use real-time data from Firebase. Once you add properties to Firestore, they will automatically appear in your app.

## 🚀 Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Build your app:
   ```bash
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

## 🔐 Production Security

Before going to production:

1. **Update Firestore Rules**: Restrict access based on your business logic
2. **Update Storage Rules**: Ensure proper access control
3. **Enable App Check**: Add app verification
4. **Set up Monitoring**: Enable Firebase Performance Monitoring
5. **Configure Analytics**: Set up proper event tracking

## 📱 Features Enabled

With Firebase integration, your app now has:

- ✅ **User Authentication** (Email/Password + Google)
- ✅ **Real-time Database** (Firestore)
- ✅ **File Storage** (Firebase Storage)
- ✅ **User Profiles** (Custom user data)
- ✅ **Favorites System** (User-specific data)
- ✅ **Property Views Tracking** (Analytics)
- ✅ **Real-time Updates** (Live data sync)

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your Firebase configuration in `config.js`
   - Ensure all fields are correctly filled

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Ensure user is authenticated when required

3. **Images not loading**
   - Check Storage security rules
   - Verify image URLs are correct

4. **Authentication not working**
   - Ensure Authentication is enabled in Firebase Console
   - Check that sign-in methods are properly configured

### Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

---

🎉 **Your EV Tap app is now connected to Firebase!** Users can sign up, sign in, and enjoy real-time features.
