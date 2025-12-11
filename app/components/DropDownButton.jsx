'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'

export default function DropDownButton({ items }) {
    const [isOpen, setIsOpen] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setCoords({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 160 // Adjust for width (approx 192px/12rem) - slightly offset to align right
            })
        }
    }

    useEffect(() => {
        if (isOpen) {
            updatePosition()
            window.addEventListener('resize', updatePosition)
            window.addEventListener('scroll', updatePosition, true)
        }
        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition, true)
        }
    }, [isOpen])

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                // If clicking outside button (and menu is handled via portal backdrop or logic), close it.
                // Since menu is in portal, we need a refined check or a backdrop.
                // A transparent backdrop is easier with portals.
            }
        }
        // document.addEventListener("mousedown", handleClickOutside)
        // return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation()
                    updatePosition() // Set initial position before opening
                    setIsOpen(!isOpen)
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            >
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {isOpen && createPortal(
                <>
                    {/* Transparent Backdrop to handle click outside */}
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        className="absolute w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-[9999] transform transition-all duration-200"
                        style={{ top: coords.top, left: coords.left }}
                    >
                        <div className="py-1">
                            {items.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        item.onClick(e)
                                        setIsOpen(false)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
