interface UserData {
  id: string
  name: string
  email: string
  company: string
  avatar?: string
  preferences: {
    currency: string
    timezone: string
    language: string
  }
  stats: {
    totalTrips: number
    totalSpent: number
    savedAmount: number
    carbonOffset: number
  }
}

interface TripData {
  id: string
  userId: string
  destination: string
  startDate: string
  endDate: string
  type: "business" | "personal"
  status: "confirmed" | "pending" | "cancelled"
  flight?: {
    number: string
    airline: string
    departure: string
    arrival: string
  }
  hotel?: {
    name: string
    address: string
    checkIn: string
    checkOut: string
  }
  totalCost: number
}

interface ExpenseData {
  id: string
  userId: string
  tripId?: string
  description: string
  amount: number
  currency: string
  category: string
  date: string
  status: "pending" | "approved" | "rejected"
  receipt?: string
}

interface MeetingData {
  id: string
  userId: string
  title: string
  startTime: string
  endTime: string
  attendees: number
  location?: string
  type: "in-person" | "video" | "phone"
}

class UserDataService {
  private storageKey = "suitpax_user_data"
  private tripsKey = "suitpax_trips_data"
  private expensesKey = "suitpax_expenses_data"
  private meetingsKey = "suitpax_meetings_data"

  // User Data Management
  getUserData(): UserData | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      // Initialize with empty data for new user
      return this.initializeNewUser()
    }
    return JSON.parse(stored)
  }

  saveUserData(userData: UserData): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(userData))
  }

  private initializeNewUser(): UserData {
    const newUser: UserData = {
      id: `user_${Date.now()}`,
      name: "",
      email: "",
      company: "",
      preferences: {
        currency: "USD",
        timezone: "UTC",
        language: "en",
      },
      stats: {
        totalTrips: 0,
        totalSpent: 0,
        savedAmount: 0,
        carbonOffset: 0,
      },
    }
    this.saveUserData(newUser)
    return newUser
  }

  // Trips Management
  getUserTrips(userId: string): TripData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.tripsKey)
    if (!stored) return []

    const allTrips: TripData[] = JSON.parse(stored)
    return allTrips.filter((trip) => trip.userId === userId)
  }

  addTrip(trip: Omit<TripData, "id">): TripData {
    const newTrip: TripData = {
      ...trip,
      id: `trip_${Date.now()}`,
    }

    const existingTrips = this.getAllTrips()
    const updatedTrips = [...existingTrips, newTrip]

    if (typeof window !== "undefined") {
      localStorage.setItem(this.tripsKey, JSON.stringify(updatedTrips))
    }

    // Update user stats
    this.updateUserStats(trip.userId)

    return newTrip
  }

  private getAllTrips(): TripData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.tripsKey)
    return stored ? JSON.parse(stored) : []
  }

  // Expenses Management
  getUserExpenses(userId: string): ExpenseData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.expensesKey)
    if (!stored) return []

    const allExpenses: ExpenseData[] = JSON.parse(stored)
    return allExpenses.filter((expense) => expense.userId === userId)
  }

  addExpense(expense: Omit<ExpenseData, "id">): ExpenseData {
    const newExpense: ExpenseData = {
      ...expense,
      id: `expense_${Date.now()}`,
    }

    const existingExpenses = this.getAllExpenses()
    const updatedExpenses = [...existingExpenses, newExpense]

    if (typeof window !== "undefined") {
      localStorage.setItem(this.expensesKey, JSON.stringify(updatedExpenses))
    }

    // Update user stats
    this.updateUserStats(expense.userId)

    return newExpense
  }

  private getAllExpenses(): ExpenseData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.expensesKey)
    return stored ? JSON.parse(stored) : []
  }

  // Meetings Management
  getUserMeetings(userId: string, date?: string): MeetingData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.meetingsKey)
    if (!stored) return []

    const allMeetings: MeetingData[] = JSON.parse(stored)
    let userMeetings = allMeetings.filter((meeting) => meeting.userId === userId)

    if (date) {
      userMeetings = userMeetings.filter((meeting) => meeting.startTime.startsWith(date))
    }

    return userMeetings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }

  addMeeting(meeting: Omit<MeetingData, "id">): MeetingData {
    const newMeeting: MeetingData = {
      ...meeting,
      id: `meeting_${Date.now()}`,
    }

    const existingMeetings = this.getAllMeetings()
    const updatedMeetings = [...existingMeetings, newMeeting]

    if (typeof window !== "undefined") {
      localStorage.setItem(this.meetingsKey, JSON.stringify(updatedMeetings))
    }

    return newMeeting
  }

  private getAllMeetings(): MeetingData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.meetingsKey)
    return stored ? JSON.parse(stored) : []
  }

  // Stats Calculation
  private updateUserStats(userId: string): void {
    const userData = this.getUserData()
    if (!userData || userData.id !== userId) return

    const trips = this.getUserTrips(userId)
    const expenses = this.getUserExpenses(userId)

    const totalTrips = trips.length
    const totalSpent = expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0)

    // Calculate savings (mock calculation - 15% of total spent)
    const savedAmount = Math.round(totalSpent * 0.15)

    // Calculate carbon offset (mock calculation - 0.05 tons per trip)
    const carbonOffset = Math.round(totalTrips * 0.05 * 100) / 100

    userData.stats = {
      totalTrips,
      totalSpent,
      savedAmount,
      carbonOffset,
    }

    this.saveUserData(userData)
  }

  // Utility Methods
  clearUserData(userId: string): void {
    if (typeof window === "undefined") return

    // Clear user data
    localStorage.removeItem(this.storageKey)

    // Clear trips
    const allTrips = this.getAllTrips()
    const filteredTrips = allTrips.filter((trip) => trip.userId !== userId)
    localStorage.setItem(this.tripsKey, JSON.stringify(filteredTrips))

    // Clear expenses
    const allExpenses = this.getAllExpenses()
    const filteredExpenses = allExpenses.filter((expense) => expense.userId !== userId)
    localStorage.setItem(this.expensesKey, JSON.stringify(filteredExpenses))

    // Clear meetings
    const allMeetings = this.getAllMeetings()
    const filteredMeetings = allMeetings.filter((meeting) => meeting.userId !== userId)
    localStorage.setItem(this.meetingsKey, JSON.stringify(filteredMeetings))
  }

  // Demo data for testing (optional)
  initializeDemoData(userId: string): void {
    // Add some demo trips
    this.addTrip({
      userId,
      destination: "New York",
      startDate: "2024-12-15",
      endDate: "2024-12-18",
      type: "business",
      status: "confirmed",
      flight: {
        number: "AA 1234",
        airline: "American Airlines",
        departure: "2024-12-15T08:00:00Z",
        arrival: "2024-12-15T14:00:00Z",
      },
      hotel: {
        name: "Marriott Times Square",
        address: "1535 Broadway, New York, NY",
        checkIn: "2024-12-15",
        checkOut: "2024-12-18",
      },
      totalCost: 1250,
    })

    // Add some demo expenses
    this.addExpense({
      userId,
      description: "Business Lunch - Client Meeting",
      amount: 125.5,
      currency: "USD",
      category: "meals",
      date: new Date().toISOString(),
      status: "pending",
    })

    // Add some demo meetings
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    this.addMeeting({
      userId,
      title: "Q1 Planning Meeting",
      startTime: `${todayStr}T10:00:00Z`,
      endTime: `${todayStr}T11:00:00Z`,
      attendees: 5,
      location: "Conference Room A",
      type: "in-person",
    })
  }
}

export const userDataService = new UserDataService()
export type { UserData, TripData, ExpenseData, MeetingData }
