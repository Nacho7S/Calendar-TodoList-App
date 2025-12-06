'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../utils/translations';


const ThemeContext = createContext();


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  // Load theme and language from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'en';

    setTheme(savedTheme);
    setLanguage(savedLanguage);
  }, []);

  // Update localStorage and apply theme when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Remove any existing theme classes
    document.documentElement.classList.remove('light', 'dark', 'oled', 'red', 'pink');
    // Add the current theme class
    document.documentElement.classList.add(theme);

    // Update CSS variables based on theme
    updateCSSVariables(theme);
  }, [theme]);

  // Update language in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Listen for theme and language changes from auth provider
  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail.theme || 'light');
    };

    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language || 'en');
    };

    window.addEventListener('themechange', handleThemeChange);
    window.addEventListener('languagechange', handleLanguageChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  const updateCSSVariables = (selectedTheme) => {
    const root = document.documentElement;

    switch(selectedTheme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f3f4f6');
        root.style.setProperty('--text-primary', '#1f2937');
        root.style.setProperty('--text-secondary', '#6b7280');
        root.style.setProperty('--border-color', '#e5e7eb');
        root.style.setProperty('--accent-color', '#3b82f6');
        root.style.setProperty('--hover-bg', '#f9fafb');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', '#1f2937');
        root.style.setProperty('--bg-secondary', '#111827');
        root.style.setProperty('--text-primary', '#f9fafb');
        root.style.setProperty('--text-secondary', '#d1d5db');
        root.style.setProperty('--border-color', '#374151');
        root.style.setProperty('--accent-color', '#60a5fa');
        root.style.setProperty('--hover-bg', '#374151');
        break;
      case 'oled':
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-secondary', '#0a0a0a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#cccccc');
        root.style.setProperty('--border-color', '#333333');
        root.style.setProperty('--accent-color', '#ff6b6b');
        root.style.setProperty('--hover-bg', '#1a1a1a');
        break;
      case 'red':
        root.style.setProperty('--bg-primary', '#fef2f2');
        root.style.setProperty('--bg-secondary', '#fecaca');
        root.style.setProperty('--text-primary', '#7f1d1d');
        root.style.setProperty('--text-secondary', '#991b1b');
        root.style.setProperty('--border-color', '#fecaca');
        root.style.setProperty('--accent-color', '#ef4444');
        root.style.setProperty('--hover-bg', '#fecaca');
        break;
      case 'pink':
        root.style.setProperty('--bg-primary', '#fdf2f8');
        root.style.setProperty('--bg-secondary', '#fce7f3');
        root.style.setProperty('--text-primary', '#831843');
        root.style.setProperty('--text-secondary', '#9d174d');
        root.style.setProperty('--border-color', '#fce7f3');
        root.style.setProperty('--accent-color', '#ec4899');
        root.style.setProperty('--hover-bg', '#fce7f3');
        break;
      default:
        break;
    }
  };

  // Function to get translation
  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return translation;
  };


  const availableThemes = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'oled', name: 'OLED Dark' },
    { id: 'red', name: 'Red' },
    { id: 'pink', name: 'Pink' }
  ];

  const availableLanguages = [
    { id: 'en', name: 'English' },
    { id: 'ja', name: '日本語 (Japanese)' },
    { id: 'es', name: 'Español (Spanish)' },
    { id: 'id', name: 'Indonesia (Indonesian)' },
    { id: 'fr', name: 'Français (French)' },
    { id: 'de', name: 'Deutsch (German)' },
    { id: 'zh', name: '中文 (Chinese)' },
    { id: 'ko', name: '한국어 (Korean)' }
  ];

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
    availableThemes,
    availableLanguages,
    t
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};