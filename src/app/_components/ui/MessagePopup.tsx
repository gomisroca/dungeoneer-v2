'use client'

import { signal, useSignal, useSignalEffect } from '@preact-signals/safe-react';
import { Alert, AlertTitle } from './Alert'
import { FaX } from 'react-icons/fa6';

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

  if (notifications.value.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.value.map((notification) => (
      <Alert key={notification.id}>
        <FaX onClick={() => removeNotification(notification.id)} className='cursor-pointer' />
        <AlertTitle>{notification.message}</AlertTitle>
      </Alert>
      ))}
    </div>
  )
}