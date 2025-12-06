"use client"

import React, { useState } from 'react';
import { useAuth } from '../../app/providers/authProvider';
import { useTheme } from '../../app/providers/themeProvider';

export default function ProfilePage() {
  const { user, updatePassword, deleteAccount } = useAuth();
  const { theme, t } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [usernameConfirmation, setUsernameConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError(t('profile.newPasswordNotMatch') || 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError(t('profile.passwordTooShort') || 'New password must be at least 6 characters');
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess(t('profile.passwordUpdated') || 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || t('profile.passwordUpdateFailed') || 'Failed to update password');
    }
  };

  const handleAccountDeletion = async () => {
    if (usernameConfirmation !== user?.username) {
      setError(t('profile.usernameNotMatch') || 'Username confirmation does not match');
      return;
    }

    if (!window.confirm(t('profile.confirmDelete') || 'Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAccount();
      // The user will be logged out and redirected by the auth provider
    } catch (err) {
      setError(err.message || t('profile.deleteFailed') || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">{t('profile.title')}</h1>

      {error && (
        <div className="mb-4 p-3 bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] rounded-md border border-[color:var(--border-color)]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] rounded-md border border-[color:var(--border-color)]">
          {success}
        </div>
      )}

      {/* Change Password Section */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md mb-6 border border-[var(--border-color)]">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">{t('profile.changePassword')}</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t('profile.currentPassword')}
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t('profile.newPassword')}
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              required
              minLength={6}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t('profile.confirmNewPassword')}
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[var(--accent-color)] text-[var(--text-primary)] px-4 py-2 rounded-md hover:bg-[color:var(--accent-color)]/[0.8] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          >
            {t('profile.changePasswordButton')}
          </button>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md border border-[var(--border-color)]">
        <h2 className="text-xl font-semibold mb-4 text-red-500">{t('profile.deleteAccount')}</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          {t('profile.deleteAccountWarning')}
        </p>

        <div className="mb-4">
          <label htmlFor="usernameConfirmation" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {t('profile.typeUsername')} <span className="font-semibold">{user?.username}</span>
          </label>
          <input
            type="text"
            id="usernameConfirmation"
            value={usernameConfirmation}
            onChange={(e) => setUsernameConfirmation(e.target.value)}
            className="w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            placeholder={`Enter ${user?.username}`}
          />
        </div>

        <button
          onClick={() => setIsDeleting(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {t('profile.requestDeletion')}
        </button>

        {isDeleting && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 mb-3">
              {t('profile.confirmDelete')}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleAccountDeletion}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                {t('profile.confirmDeletion')}
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                {t('profile.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
