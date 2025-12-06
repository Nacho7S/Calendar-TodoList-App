'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user && user.theme && user.language) {
      const currentTheme = localStorage.getItem("theme");
      const currentLanguage = localStorage.getItem("language");

      if (currentTheme !== user.theme) {
        localStorage.setItem('theme', user.theme);
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: user.theme } }));
      }

      if (currentLanguage !== user.language) {
        localStorage.setItem('language', user.language);
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: user.language } }));
      }
    } else if (user && !user.language || !user) {
      autoDetectLanguage();
    }
  }, [user]);

  const autoDetectLanguage = () => {
    const browserLang = navigator.language || navigator.languages[0] || 'en-US';

    let detectedLang = 'en';

    if (browserLang.startsWith('ja')) detectedLang = 'ja';
    else if (browserLang.startsWith('es')) detectedLang = 'es';
    else if (browserLang.startsWith('id')) detectedLang = 'id';
    else if (browserLang.startsWith('fr')) detectedLang = 'fr';
    else if (browserLang.startsWith('de')) detectedLang = 'de';
    else if (browserLang.startsWith('zh')) detectedLang = 'zh';
    else if (browserLang.startsWith('ko')) detectedLang = 'ko';
    else if (browserLang.startsWith('en')) detectedLang = 'en';


    const currentLanguage = localStorage.getItem('language');
    if (currentLanguage !== detectedLang) {
      localStorage.setItem('language', detectedLang);
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

        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
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

        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
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

        if (data.user.theme) {
          localStorage.setItem('theme', data.user.theme);
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: data.user.theme } }));
        }
        if (data.user.language) {
          localStorage.setItem('language', data.user.language);
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
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to log out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
      });

      if (result.isConfirmed) {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        setUser(null);

        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error logging out. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

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
        setUser(prevUser => ({
          ...prevUser,
          theme: theme,
          language: language
        }));

        if (theme) {
          localStorage.setItem('theme', theme);
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
        }
        if (language) {
          localStorage.setItem('language', language);
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

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Password updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 1500,
          timerProgressBar: true
        });
        return { success: true, message: data.message };
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Error updating password',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Password update error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Network error. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        Swal.fire({
          title: 'Account Deleted!',
          text: 'Your account has been successfully deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirect to login page or home page after account deletion
          window.location.href = '/login';
        });
        return { success: true, message: data.message };
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Error deleting account',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Network error. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
    updatePassword,
    deleteAccount,
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