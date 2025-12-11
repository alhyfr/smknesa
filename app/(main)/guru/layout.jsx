import { cookies } from 'next/headers'
import { UserProvider } from '@/app/context/UserContext'
import LayoutClient from '@/app/components/LayoutClient'
import { motion } from 'motion/react'

export default async function LayoutGuru({ children }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    let userData = { username: 'Unknown', role: 'Unknown' }
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            userData = {
                username: payload.username || 'Unknown',
                role: payload.role || 'Unknown'
            }
        } catch (error) {
            console.error('Error decoding token:', error.message)
        }
    }
    return (
        <UserProvider userData={userData}>
            <LayoutClient>
                {children}
            </LayoutClient>
        </UserProvider>
    )
}