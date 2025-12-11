'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, User, LogOut, UserRoundCog, LayoutDashboard, Calendar, GraduationCap, Settings } from 'lucide-react'
import { logout } from '@/app/server/Auth'
import BlurText from './BlurText'

export default function HeaderSiswa({ userData }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const pathname = usePathname()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = async () => {
        await logout()
        // No need to manually redirect if logout action creates revalidatePath or redirect
        // But for client side smooth UX, we can redirect
        window.location.href = '/login'
    }

    const navigation = [
        { name: 'Lapor Tindak Bullying', href: '/siswa/buli', icon: UserRoundCog },
        { name: 'Jadwal', href: '/siswa/jadwal', icon: Calendar },
        { name: 'Nilai', href: '/siswa/nilai', icon: GraduationCap },
    ]

    const isActive = (path) => pathname === path

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
                ? 'bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:via-slate-900/80 dark:to-gray-900/80 backdrop-blur-md shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/siswa/home" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            <BlurText text="SMK Nesa Connect" />
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 group ${isActive(item.href)
                                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                    {isActive(item.href) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-full border border-blue-200 dark:border-blue-800"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Profile & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 pr-2 max-w-[100px] truncate">
                                    {userData?.username || 'Siswa'}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 ring-opacity-5 py-1 focus:outline-none overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {userData?.username}
                                            </p>
                                        </div>
                                        <Link
                                            href="/siswa/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(item.href)
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
