"use client";

import React from 'react';
import { useTheme } from '../../app/providers/themeProvider';
import { useAuth } from '../providers/authProvider';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const { theme, setTheme, language, setLanguage, availableThemes, availableLanguages, t } = useTheme();

  const { updateUserPreferences } = useAuth();

  const handleChangeThemeColour = async (selectedTheme) => {
    setTheme(selectedTheme)


    if (updateUserPreferences) {
      try {
        const result = await updateUserPreferences(selectedTheme, language);
        if (result.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Theme updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message || 'Error updating theme',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Error updating theme. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }

  const handleThemeChangeSelect = async (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);


    if (updateUserPreferences) {
      try {
        const result = await updateUserPreferences(newTheme, language);
        if (result.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Theme updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message || 'Error updating theme',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Error updating theme. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);


    if (updateUserPreferences) {
      try {
        const result = await updateUserPreferences(theme, newLanguage);
        if (result.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Language updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message || 'Error updating language',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Error updating language. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">{t('settings.title')}</h1>

      {/* Theme Selection */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md mb-6 border border-[var(--border-color)]">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">{t('settings.themeSettings')}</h2>
        <div className="mb-4">
          <label htmlFor="themeSelect" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            {t('settings.selectTheme')}
          </label>
          <select
            id="themeSelect"
            value={theme}
            onChange={handleThemeChangeSelect}
            className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            {availableThemes.map((availableTheme) => (
              <option key={availableTheme.id} value={availableTheme.id} className="text-[var(--text-primary)] bg-[var(--bg-primary)]">
                {availableTheme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Preview */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">{t('settings.themePreview')}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {availableThemes.map((availableTheme) => (
              <div
                key={availableTheme.id}
                onClick={() => handleChangeThemeColour(availableTheme.id)}
                className={`p-3 rounded-md cursor-pointer border-2 ${
                  theme === availableTheme.id
                    ? 'border-[var(--accent-color)] ring-2 ring-[color:var(--accent-color)]/[0.3]'
                    : 'border-[var(--border-color)]'
                }`}
                style={{
                  backgroundColor:
                    availableTheme.id === 'light' ? '#ffffff' :
                    availableTheme.id === 'dark' ? '#1f2937' :
                    availableTheme.id === 'oled' ? '#000000' :
                    availableTheme.id === 'red' ? '#fef2f2' :
                    '#fdf2f8',
                  color:
                    availableTheme.id === 'light' ? '#1f2937' :
                    availableTheme.id === 'dark' ? '#f9fafb' :
                    availableTheme.id === 'oled' ? '#ffffff' :
                    availableTheme.id === 'red' ? '#7f1d1d' :
                    '#831843'
                }}
              >
                <p className="font-medium">{availableTheme.name}</p>
                <div className="mt-2 flex space-x-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        availableTheme.id === 'light' ? '#3b82f6' :
                        availableTheme.id === 'dark' ? '#60a5fa' :
                        availableTheme.id === 'oled' ? '#ff6b6b' :
                        availableTheme.id === 'red' ? '#ef4444' :
                        '#ec4899'
                    }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        availableTheme.id === 'light' ? '#f3f4f6' :
                        availableTheme.id === 'dark' ? '#111827' :
                        availableTheme.id === 'oled' ? '#0a0a0a' :
                        availableTheme.id === 'red' ? '#fecaca' :
                        '#fce7f3'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md border border-[var(--border-color)]">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">{t('settings.languageSettings')}</h2>
        <div className="mb-4">
          <label htmlFor="languageSelect" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            {t('settings.selectLanguage')}
          </label>
          <select
            id="languageSelect"
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.id} value={lang.id} className="text-[var(--text-primary)] bg-[var(--bg-primary)]">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 p-3 bg-[color:var(--accent-color)]/[0.1] rounded-md">
          <p className="text-sm text-[var(--text-primary)]">
            {t('settings.currentLanguage')} <span className="font-medium">{availableLanguages.find(l => l.id === language)?.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
