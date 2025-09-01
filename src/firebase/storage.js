import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './config';

// Upload property images
export const uploadPropertyImages = async (propertyId, files) => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const imageRef = ref(storage, `properties/${propertyId}/image_${index + 1}_${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });
    
    const downloadURLs = await Promise.all(uploadPromises);
    return { success: true, urls: downloadURLs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload single image
export const uploadImage = async (path, file) => {
  try {
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload user avatar
export const uploadUserAvatar = async (userId, file) => {
  try {
    const avatarRef = ref(storage, `users/${userId}/avatar_${Date.now()}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete image
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all images for a property
export const getPropertyImages = async (propertyId) => {
  try {
    const imagesRef = ref(storage, `properties/${propertyId}`);
    const result = await listAll(imagesRef);
    
    const downloadPromises = result.items.map(async (itemRef) => {
      return await getDownloadURL(itemRef);
    });
    
    const urls = await Promise.all(downloadPromises);
    return { success: true, urls };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
