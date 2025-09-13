import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const GoogleCallback = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Processing Google authentication...');
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        // Get the token from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(decodeURIComponent(error));
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        // Handle the Google authentication
        const result = await handleGoogleCallback(token);

        if (result.success) {
          // Directly redirect to dashboard without showing success page
          navigate('/dashboard');
        } else {
          setStatus('error');
          setMessage(result.error || 'Authentication failed');
          setTimeout(() => navigate('/auth'), 3000);
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    processGoogleCallback();
  }, [handleGoogleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Signing you in...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="p-3 bg-red-100 rounded-full inline-block mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
