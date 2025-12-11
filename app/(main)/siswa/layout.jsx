import { cookies } from 'next/headers'
import { UserProvider } from '@/app/context/UserContext'

import HeaderSiswa from '@/app/components/HeaderSiswa'

export default async function LayoutSiswa({ children }) {
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <HeaderSiswa userData={userData} />
                <main className="pt-20 pb-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </UserProvider>
    )
}