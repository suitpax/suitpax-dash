"use client"

import { useState, useEffect } from "react"
import {
  userDataService,
  type UserData,
  type TripData,
  type ExpenseData,
  type MeetingData,
} from "@/lib/services/user-data.service"

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = userDataService.getUserData()
    setUserData(data)
    setLoading(false)
  }, [])

  const updateUserData = (updates: Partial<UserData>) => {
    if (!userData) return

    const updatedData = { ...userData, ...updates }
    userDataService.saveUserData(updatedData)
    setUserData(updatedData)
  }

  const initializeDemoData = () => {
    if (!userData) return
    userDataService.initializeDemoData(userData.id)
    // Refresh data
    const refreshedData = userDataService.getUserData()
    setUserData(refreshedData)
  }

  return {
    userData,
    loading,
    updateUserData,
    initializeDemoData,
  }
}

export function useUserTrips(userId?: string) {
  const [trips, setTrips] = useState<TripData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const userTrips = userDataService.getUserTrips(userId)
    setTrips(userTrips)
    setLoading(false)
  }, [userId])

  const addTrip = (tripData: Omit<TripData, "id" | "userId">) => {
    if (!userId) return

    const newTrip = userDataService.addTrip({ ...tripData, userId })
    setTrips((prev) => [...prev, newTrip])
  }

  return {
    trips,
    loading,
    addTrip,
  }
}

export function useUserExpenses(userId?: string) {
  const [expenses, setExpenses] = useState<ExpenseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const userExpenses = userDataService.getUserExpenses(userId)
    setExpenses(userExpenses)
    setLoading(false)
  }, [userId])

  const addExpense = (expenseData: Omit<ExpenseData, "id" | "userId">) => {
    if (!userId) return

    const newExpense = userDataService.addExpense({ ...expenseData, userId })
    setExpenses((prev) => [...prev, newExpense])
  }

  return {
    expenses,
    loading,
    addExpense,
  }
}

export function useUserMeetings(userId?: string, date?: string) {
  const [meetings, setMeetings] = useState<MeetingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const userMeetings = userDataService.getUserMeetings(userId, date)
    setMeetings(userMeetings)
    setLoading(false)
  }, [userId, date])

  const addMeeting = (meetingData: Omit<MeetingData, "id" | "userId">) => {
    if (!userId) return

    const newMeeting = userDataService.addMeeting({ ...meetingData, userId })
    setMeetings((prev) =>
      [...prev, newMeeting].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    )
  }

  return {
    meetings,
    loading,
    addMeeting,
  }
}
