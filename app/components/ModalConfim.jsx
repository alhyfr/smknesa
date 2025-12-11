'use client'

import Modal from './Modal'
import Button from './Button'

export default function ModalConfirm({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    variant = 'danger',
    loading = false
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            showCloseButton={false}
            footer={
                <>
                    <Button
                        label={cancelLabel}
                        onClick={onClose}
                        variant="ghost"
                        disabled={loading}
                    />
                    <Button
                        label={confirmLabel}
                        onClick={onConfirm}
                        variant={variant}
                        loading={loading}
                    />
                </>
            }
        >
            <div className="flex flex-col items-center text-center p-2">
                <div className={`p-3 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                    {message}
                </p>
            </div>
        </Modal>
    )
}
