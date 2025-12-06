'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/authProvider';
import { useTheme } from '../providers/themeProvider';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { theme, t } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(username, password, email);

    if (result.success) {
      router.push('/home');
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[color:var(--accent-color)]/[0.7] bg-clip-text text-transparent mb-2">
            NACALENDAR
          </h1>
          <h2 className="mt-4 text-center text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
            {t('register.title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[color:var(--accent-color)]/[0.2] border border-[var(--accent-color)] text-[var(--text-primary)] px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">{t('register.username')}</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-t-md focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder={t('register.username') || "Username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">{t('register.email')}</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder={t('register.email') || "Email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('register.password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-b-md focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] focus:z-10 sm:text-sm"
                placeholder={t('register.password') || "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a onClick={() => router.push("/login")} className="font-medium text-[var(--accent-color)] hover:text-[color:var(--accent-color)]/[0.8]">
                {t('register.hasAccount')}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[var(--text-primary)] bg-[var(--accent-color)] hover:bg-[color:var(--accent-color)]/[0.8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
            >
              {t('register.register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}