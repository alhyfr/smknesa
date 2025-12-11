'use client'

import { createContext, useContext } from 'react'

// Create context
const UserContext = createContext(null)

// Provider component
export function UserProvider({ children, userData }) {
    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    )
}

// Custom hook untuk menggunakan user data
export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context
}
