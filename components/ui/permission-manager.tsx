"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Shield, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface PermissionManagerProps {
  userId: string
  userName: string
  userRole: string
  permissions: Permission[]
  onSave: (userId: string, permissions: Permission[]) => void
  onCancel: () => void
}

export function PermissionManager({
  userId,
  userName,
  userRole,
  permissions,
  onSave,
  onCancel,
}: PermissionManagerProps) {
  const [userPermissions, setUserPermissions] = useState<Permission[]>(permissions)
  const [isSaving, setIsSaving] = useState(false)

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setUserPermissions(
      userPermissions.map((permission) => {
        if (permission.id === permissionId) {
          return { ...permission, enabled }
        }
        return permission
      }),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(userId, userPermissions)
    } catch (error) {
      console.error("Failed to save permissions", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissions for {userName}
        </CardTitle>
        <CardDescription>{userRole} • Manage what this team member can access</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPermissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-sm">{permission.name}</p>
                  <p className="text-xs text-gray-500">{permission.description}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {permission.enabled
                          ? `${userName} will have access to this feature`
                          : `${userName} will not have access to this feature`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={permission.enabled}
                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
