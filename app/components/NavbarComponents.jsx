"use client"

import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../providers/authProvider'
import { useTheme } from '../providers/themeProvider'

export default function NavbarComponents() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme, availableThemes, t } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleProfile = () => {
    router.push('/profile')
    setDropdownOpen(false)
  }

  const handleSettings = () => {
    router.push('/settings')
    setDropdownOpen(false)
  }

  if (pathname === "/login" || pathname === "/register") {
    return (<></>)
  } else {
    return (
      <div className='bg-[var(--bg-secondary)] w-full h-16 flex flex-row justify-between items-center p-4 sm:p-5'>
        <div className="text-lg font-semibold text-[var(--text-primary)] hover:cursor-pointer" onClick={() => router.push("/home")}>
          NACALENDAR
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 sm:space-x-2 focus:outline-none text-[var(--text-primary)]"
          >
            <span className="text-sm sm:text-base">{t('navbar.hello')}{user ? user.username : 'Guest'} !</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {dropdownOpen && (
            <>
              {/* Mobile Full Screen Dropdown */}
              <div className="fixed inset-0 bg-opacity-0 z-40 sm:hidden" onClick={() => setDropdownOpen(false)}></div>
              <div className="sm:hidden absolute top-[3rem] right-0 w-screen h-auto bg-[var(--bg-primary)] rounded-md shadow-lg py-1 z-50 border border-[var(--border-color)]">
                <div className="h-full flex flex-col">
                  {/* <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--text-primary)]">{t('navbar.settings')}</h3>
                  </div> */}
                  <div className="flex-1 flex flex-col">
                    <button
                      onClick={handleProfile}
                      className=" block w-full text-center px-4 py-3 text-base text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border-b border-[var(--border-color)]"
                    >
                      {t('navbar.myProfile')}
                    </button>
                    <button
                      onClick={handleSettings}
                      className="block w-full text-center px-4 py-3 text-base text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border-b border-[var(--border-color)]"
                    >
                      {t('navbar.settings')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-3 text-base text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                    >
                      {t('navbar.logout')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop dropdown */}
              <div className="hidden sm:block absolute right-0 sm:mt-2 bg-[var(--bg-primary)] rounded-md shadow-lg py-1 z-50 border border-[var(--border-color)] w-44">
                <button
                  onClick={handleProfile}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                >
                  {t('navbar.myProfile')}
                </button>
                <button
                  onClick={handleSettings}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                >
                  {t('navbar.settings')}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}