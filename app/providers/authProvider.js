'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Sync theme and language from user data to localStorage when user changes
  useEffect(() => {
    if (user && user.theme && user.language) {
      const currentTheme = localStorage.getItem("theme");
      const currentLanguage = localStorage.getItem("language");

      // Update localStorage if values differ from user preferences
      if (currentTheme !== user.theme) {
        localStorage.setItem('theme', user.theme);
        // Dispatch an event to notify the theme provider to update
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: user.theme } }));
      }

      if (currentLanguage !== user.language) {
        localStorage.setItem('language', user.language);
        // Dispatch an event to notify the theme provider to update
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: user.language } }));
      }
    } else if (user && !user.language || !user) {
      // If user is logged in but doesn't have language preference, auto-detect
      autoDetectLanguage();
    }
  }, [user]);

  // Function to auto-detect language based on browser preferences
  const autoDetectLanguage = () => {
    // Check browser language preferences
    const browserLang = navigator.language || navigator.languages[0] || 'en-US';

    // Map browser language to our supported languages
    let detectedLang = 'en'; // default to English

    if (browserLang.startsWith('ja')) detectedLang = 'ja';
    else if (browserLang.startsWith('es')) detectedLang = 'es';
    else if (browserLang.startsWith('id')) detectedLang = 'id';
    else if (browserLang.startsWith('fr')) detectedLang = 'fr';
    else if (browserLang.startsWith('de')) detectedLang = 'de';
    else if (browserLang.startsWith('zh')) detectedLang = 'zh';
    else if (browserLang.startsWith('ko')) detectedLang = 'ko';
    else if (browserLang.startsWith('en')) detectedLang = 'en';

    console.log(browserLang);
    

    // Update localStorage with detected language if it differs from current
    const currentLanguage = localStorage.getItem('language');
    if (currentLanguage !== detectedLang) {
      localStorage.setItem('language', detectedLang);
      // Dispatch an event to notify the theme provider to update
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: detectedLang } }));
    }
  };


  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.userId,
          username: data.user.username,
          theme: data.user.theme,
          language: data.user.language
        });

        // Set theme and language in localStorage to match user preferences
        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: data.user.language } }));
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      

      if (data.success) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          theme: data.user.theme,
          language: data.user.language
        });

        // Set theme and language in localStorage to match user preferences
        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: data.user.language } }));
        }

        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          theme: data.user.theme,
          language: data.user.language
        });

        // Set theme and language in localStorage to match user preferences
        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: data.user.language } }));
        }

        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to update user theme and language in both DB and sessionStorage
  const updateUserPreferences = async (theme, language) => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme, language }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user state with new preferences
        setUser(prevUser => ({
          ...prevUser,
          theme: theme,
          language: language
        }));

        // Also update localStorage and dispatch events for consistency
        if (theme) {
          localStorage.setItem('theme', theme);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
        }
        if (language) {
          localStorage.setItem('language', language);
          // Dispatch an event to notify the theme provider to update
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: language } }));
        }

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserPreferences,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}