'use client'

import { signal, useSignalEffect } from '@preact-signals/safe-react';
import { Alert, AlertTitle } from './Alert'
import { FaX } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: number
  message: string
}

export const notifications = signal<Notification[]>([])

let nextId = 1;

export function addMessage(message: string) {
  notifications.value = [...notifications.value, { id: nextId++, message }]
}

export default function MessagePopup() {

  useSignalEffect(() => {
    if (notifications.value.length > 0) {
      const timer = setTimeout(() => {
        notifications.value = notifications.value.slice(1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  })

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id)
  }

  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.value.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.3, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Alert>
              <FaX onClick={() => removeNotification(notification.id)} className='cursor-pointer' />
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}