'use client'

import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function PageTransition({ children }) {
    const pathname = usePathname()
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [displayContent, setDisplayContent] = useState(children)

    useEffect(() => {
        // Start transition
        setIsTransitioning(true)

        // Wait for transition overlay to appear, then update content
        const timer = setTimeout(() => {
            setDisplayContent(children)
            setIsTransitioning(false)
        }, 400) // Half of total transition time

        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <>
            {/* Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
                    >
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Content */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                {displayContent}
            </motion.div>
        </>
    )
}
