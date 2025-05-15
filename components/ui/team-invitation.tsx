"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, X } from "lucide-react"

interface TeamInvitationProps {
  onInvite: (emails: string[], role: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TeamInvitation({ onInvite, onCancel, isLoading = false }: TeamInvitationProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [role, setRole] = useState("team_member")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleAddEmail = () => {
    if (!currentEmail) return

    if (!validateEmail(currentEmail)) {
      setError("Please enter a valid email address")
      return
    }

    if (emails.includes(currentEmail)) {
      setError("This email has already been added")
      return
    }

    setEmails([...emails, currentEmail])
    setCurrentEmail("")
    setError("")
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (emails.length === 0 && currentEmail) {
      if (validateEmail(currentEmail)) {
        onInvite([currentEmail], role)
      } else {
        setError("Please enter a valid email address")
      }
    } else {
      onInvite(emails, role)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Invite Team Members</CardTitle>
        <CardDescription>Send invitations to your colleagues to join your team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={currentEmail}
                onChange={(e) => {
                  setCurrentEmail(e.target.value)
                  setError("")
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddEmail}>
                Add
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                {emails.map((email) => (
                  <div key={email} className="flex items-center gap-1 px-2 py-1 bg-white rounded-md border text-sm">
                    <Mail className="h-3 w-3 text-gray-500" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="travel_manager">Travel Manager</SelectItem>
                <SelectItem value="finance_manager">Finance Manager</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || (emails.length === 0 && !currentEmail)}>
          {isLoading ? "Sending..." : "Send Invitations"}
          {!isLoading && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
