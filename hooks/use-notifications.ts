"use client"

import { useState, useEffect, useCallback } from "react"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    setSupported("Notification" in window)

    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!supported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [supported])

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!supported || permission !== "granted") return null

      try {
        const notification = new Notification(title, {
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          ...options,
        })

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close()
        }, 5000)

        return notification
      } catch (error) {
        console.error("Error showing notification:", error)
        return null
      }
    },
    [supported, permission],
  )

  return {
    supported,
    permission,
    requestPermission,
    showNotification,
  }
}
