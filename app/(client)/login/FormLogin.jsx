'use client'

import { useState } from 'react'
import Image from 'next/image'
import BlurText from '@/app/components/BlurText'
import { login as loginServer } from '@/app/server/Auth'
import Model from '@/app/assets/model.png'
import { motion } from 'motion/react'
import Logo from '@/app/assets/logo.png'

export default function FormLogin() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error saat user mengetik
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const result = await loginServer({
                username: formData.username,
                password: formData.password
            })

            // Redirect berdasarkan role yang didapat dari server
            // Gunakan window.location.href untuk full page reload
            // Ini memastikan middleware membaca cookie yang baru di-set
            if (result.role === 'guru') {
                window.location.href = '/guru/dashboard'
            } else if (result.role === 'siswa') {
                window.location.href = '/siswa/home'
            }
        } catch (err) {
            setError(err.message || 'Login gagal. Silakan coba lagi.')
            setIsLoading(false) // Only set loading false on error
        }
        // Jangan set loading false di finally karena page akan redirect
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#050714]">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={100}
                            height={100}
                            className="w-24 h-24 mb-4"
                        />
                    </motion.div>
                    {/* Logo/Header */}
                    <div className="mb-8">
                        <BlurText
                            text="SMKN 1 PINRANG"
                            className="text-4xl font-bold text-[#FFFDFF] mb-2"
                            delay={50}
                            animateBy="words"
                        />
                        <BlurText
                            text="Login to access SMK Nesa Connect"
                            className="text-gray-400"
                            delay={30}
                            animateBy="words"
                        />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-[#FFFDFF] mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#010DFF] focus:ring-2 focus:ring-[#010DFF]/20 transition-all"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#FFFDFF] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#010DFF] focus:ring-2 focus:ring-[#010DFF]/20 transition-all"
                                    placeholder="Masukkan password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#010DFF] focus:ring-[#010DFF] focus:ring-offset-0"
                                />
                                <span className="ml-2 text-sm text-gray-400">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-[#010DFF] hover:text-[#04FF02] transition-colors">
                                Lupa password?
                            </a>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-[#010DFF] hover:bg-[#0109CC] text-white font-semibold rounded-lg shadow-lg shadow-[#010DFF]/30 hover:shadow-[#010DFF]/50 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : 'Login'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        © 2025 SMKN 1 PINRANG. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#010DFF] to-[#050714] relative overflow-hidden items-left justify-center">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-[#04FF02] rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#F7FA13] rounded-full opacity-10 blur-3xl"></div>

                {/* Main Illustration */}
                <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-8 px-1">
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Image
                            src={Model}
                            alt="Login Illustration"
                            width={1000}
                            height={1000}
                            className="w-full h-auto drop-shadow-2xl"
                            priority
                        />
                    </motion.div>
                    <div className="flex-1 text-left">
                        <BlurText text="SMK Nesa Connect" className="text-3xl font-bold text-white mb-4" />
                        <BlurText text="Platform Ruang Aspirasi Siswa" className="text-gray-300 text-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}