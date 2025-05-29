"use client"

import { useState, useEffect } from "react"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Para el admin, usar credenciales especiales
      if (email === "admin@agendly.com" && password === "admin123") {
        // Crear un usuario mock para el admin
        const mockUser = {
          uid: "admin",
          email: "admin@agendly.com",
          displayName: "Administrador",
        } as User
        setUser(mockUser)
        return { success: true, user: mockUser }
      }

      // Para profesionales, usar credenciales mock
      if (password === "123456") {
        const mockUser = {
          uid: email.split("@")[0],
          email: email,
          displayName: email.split("@")[0],
        } as User
        setUser(mockUser)
        return { success: true, user: mockUser }
      }

      // Intentar autenticación real con Firebase
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  }
}
