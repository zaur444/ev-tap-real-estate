import React, { useState, useEffect } from 'react';
import { getProperties } from '../firebase/database';

const FirebaseStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        const result = await getProperties();
        if (result.success) {
          setStatus('connected');
        } else {
          setStatus('error');
          setError(result.error);
        }
      } catch {
        setStatus('error');
        setError('Firebase not configured. Please check your configuration.');
      }
    };

    checkFirebaseConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          <span className="text-sm">Checking Firebase connection...</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium">Firebase Not Connected</p>
            <p className="text-xs mt-1">{error}</p>
            <a 
              href="/FIREBASE_SETUP.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs underline hover:no-underline mt-1 block"
            >
              View setup guide
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">Firebase Connected</span>
      </div>
    </div>
  );
};

export default FirebaseStatus;
