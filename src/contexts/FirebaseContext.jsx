import React, { useEffect, useState } from 'react';
import { onAuthStateChange } from '../firebase/auth';
import { getUserProfile } from '../firebase/database';
import { FirebaseContext } from './FirebaseContext';

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // Get user profile from Firestore
        const profileResult = await getUserProfile(user.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        } else {
          // Create default profile if doesn't exist
          setUserProfile({
            userId: user.uid,
            displayName: user.displayName || 'User',
            email: user.email,
            avatar: user.photoURL || null,
            preferences: {
              notifications: true,
              darkMode: false
            }
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    setUserProfile
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
