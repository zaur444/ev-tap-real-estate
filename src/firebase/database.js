import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 

  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collections
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';
const VIEWS_COLLECTION = 'views';

// Properties CRUD operations
export const addProperty = async (propertyData) => {
  try {
    const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
      ...propertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProperties = async (filters = {}) => {
  try {
    let q = collection(db, PROPERTIES_COLLECTION);
    
    // Apply filters
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.district) {
      q = query(q, where('location.district', '==', filters.district));
    }
    if (filters.propertyType) {
      q = query(q, where('propertyType', '==', filters.propertyType));
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', parseInt(filters.minPrice)));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', parseInt(filters.maxPrice)));
    }
    if (filters.minRooms) {
      q = query(q, where('rooms', '>=', parseInt(filters.minRooms)));
    }
    if (filters.isNewBuild) {
      q = query(q, where('isNewBuild', '==', true));
    }
    if (filters.nearMetro) {
      q = query(q, where('nearMetro', '==', true));
    }
    if (filters.isVerified) {
      q = query(q, where('isVerified', '==', true));
    }
    
    // Order by creation date
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: properties };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProperty = async (propertyId) => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Property not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProperty = async (propertyId, updateData) => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time property updates
export const subscribeToProperties = (callback, filters = {}) => {
  let q = collection(db, PROPERTIES_COLLECTION);
  
  // Apply filters
  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }
  if (filters.district) {
    q = query(q, where('location.district', '==', filters.district));
  }
  if (filters.propertyType) {
    q = query(q, where('propertyType', '==', filters.propertyType));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    callback(properties);
  });
};

// User favorites
export const addToFavorites = async (userId, propertyId) => {
  try {
    await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      propertyId,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (userId, propertyId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: favorites };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Property views tracking
export const trackPropertyView = async (propertyId, userId = null) => {
  try {
    await addDoc(collection(db, VIEWS_COLLECTION), {
      propertyId,
      userId,
      viewedAt: serverTimestamp()
    });
    
    // Update property view count
    const propertyRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    const propertyDoc = await getDoc(propertyRef);
    
    if (propertyDoc.exists()) {
      const currentViews = propertyDoc.data().views || 0;
      await updateDoc(propertyRef, {
        views: currentViews + 1
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User profile management
export const createUserProfile = async (userId, userData) => {
  try {
    await addDoc(collection(db, USERS_COLLECTION), {
      userId,
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
