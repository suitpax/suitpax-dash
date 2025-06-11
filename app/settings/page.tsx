"use client"

import { useSettings } from "@/contexts/settings-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Laptop, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const defaultAvatars = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742523738570-6OakYYTsIpmmUajXoJbERZPcHBpvqS.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742520787487-4jSYUSL7C8uM4hzo4AM416hhp1tW4k.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742522903929-mSDUh3XRhpp4BbuglUSK3hrICXLh7Z.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742523472896-ep1yER9PYMkN2NZfmLeVdKN3MTfPEe.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742522532843-8iYsBulLYzlOvhszXP0cllTKc9gmVo.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742522966516-E1nXXZbGCQVRSWWKRJ6aE9vt19Pj9V.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742518687967-4KWuPc4Kjg9KTYjabMIiqaq9pmuSJc.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742523542395-00rj3uD94jaE3CWtdcg2l66YFlrqFv.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742522756064-aPLIWAqUrWFbciZtgicEYTaV0WlSyI.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copilot_image_1742522183564-HquX7cl4EYF4X5UzBLROI4I6bOD7Lz.jpeg",
]

export default function SettingsPage() {
  const { settings, updateSettings, updateNotificationSettings, updatePrivacySettings } = useSettings()
  const [selectedAvatar, setSelectedAvatar] = useState(settings.avatar)

  const handleSaveAccount = () => {
    updateSettings({
      avatar: selectedAvatar,
      fullName: settings.fullName,
      email: settings.email,
      phone: settings.phone,
      timezone: settings.timezone,
    })
    toast.success("Account settings saved successfully")
  }

  const handleSaveNotifications = () => {
    updateNotificationSettings(settings.notifications)
    toast.success("Notification settings saved successfully")
  }

  const handleSavePrivacy = () => {
    updatePrivacySettings(settings.privacy)
    toast.success("Privacy settings saved successfully")
  }

  return (
    <div className="container mx-auto py-4 px-4 md:py-10 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-1 rounded-xl bg-muted">
          <TabsTrigger value="account" className="py-2.5 text-sm font-medium rounded-lg">
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="py-2.5 text-sm font-medium rounded-lg">
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="py-2.5 text-sm font-medium rounded-lg">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-2.5 text-sm font-medium rounded-lg">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="py-2.5 text-sm font-medium rounded-lg">
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Current Avatar</Label>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <Avatar className="h-16 w-16 md:h-20 md:h-20">
                    <AvatarImage src={selectedAvatar} alt={settings.fullName} />
                    <AvatarFallback>
                      {settings.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Label>Choose a new avatar</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 pb-2">
                  {defaultAvatars.map((avatar, index) => (
                    <Avatar
                      key={index}
                      className={`h-16 w-16 md:h-20 md:w-20 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary shrink-0 ${
                        selectedAvatar === avatar ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} className="object-cover" />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <Label htmlFor="custom-avatar">Or upload a custom avatar</Label>
                  <Input id="custom-avatar" type="file" accept="image/*" className="mt-1" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={settings.fullName}
                    onChange={(e) => updateSettings({ fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings({ email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateSettings({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSettings({ timezone: value })}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-12">International Date Line West (UTC-12)</SelectItem>
                      <SelectItem value="utc-11">Samoa Standard Time (UTC-11)</SelectItem>
                      <SelectItem value="utc-10">Hawaii-Aleutian Standard Time (UTC-10)</SelectItem>
                      <SelectItem value="utc-9">Alaska Standard Time (UTC-9)</SelectItem>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc-4">Atlantic Time (UTC-4)</SelectItem>
                      <SelectItem value="utc-3">Argentina Standard Time (UTC-3)</SelectItem>
                      <SelectItem value="utc-2">South Georgia Time (UTC-2)</SelectItem>
                      <SelectItem value="utc-1">Azores Time (UTC-1)</SelectItem>
                      <SelectItem value="utc+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+2">Eastern European Time (UTC+2)</SelectItem>
                      <SelectItem value="utc+3">Moscow Time (UTC+3)</SelectItem>
                      <SelectItem value="utc+4">Gulf Standard Time (UTC+4)</SelectItem>
                      <SelectItem value="utc+5">Pakistan Standard Time (UTC+5)</SelectItem>
                      <SelectItem value="utc+5.5">Indian Standard Time (UTC+5:30)</SelectItem>
                      <SelectItem value="utc+6">Bangladesh Standard Time (UTC+6)</SelectItem>
                      <SelectItem value="utc+7">Indochina Time (UTC+7)</SelectItem>
                      <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                      <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                      <SelectItem value="utc+10">Australian Eastern Standard Time (UTC+10)</SelectItem>
                      <SelectItem value="utc+11">Solomon Islands Time (UTC+11)</SelectItem>
                      <SelectItem value="utc+12">New Zealand Standard Time (UTC+12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveAccount} className="w-full sm:w-auto">
                Save Account Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account's security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button className="w-full sm:w-auto">Save Security Settings</Button>
              </CardFooter>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent login activities on your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-2">Date & Time</th>
                        <th className="pb-2">IP Address</th>
                        <th className="pb-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: "2023-07-20", time: "14:30 UTC", ip: "192.168.1.1", location: "New York, USA" },
                        { date: "2023-07-19", time: "09:15 UTC", ip: "10.0.0.1", location: "London, UK" },
                        { date: "2023-07-18", time: "22:45 UTC", ip: "172.16.0.1", location: "Tokyo, Japan" },
                      ].map((login, index) => (
                        <tr key={index}>
                          <td className="py-1">
                            {login.date} {login.time}
                          </td>
                          <td className="py-1">{login.ip}</td>
                          <td className="py-1">{login.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Currently active sessions on your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: "Laptop", browser: "Chrome", os: "Windows 10", icon: Laptop },
                  { device: "Smartphone", browser: "Safari", os: "iOS 15", icon: Smartphone },
                  { device: "Tablet", browser: "Firefox", os: "Android 12", icon: Tablet },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <session.icon className="mr-2 h-4 w-4" />
                      {session.device}
                    </span>
                    <span>{session.browser}</span>
                    <span>{session.os}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full sm:w-auto">
                  Log Out All Other Sessions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Slider defaultValue={[16]} max={24} min={12} step={1} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup defaultValue="system">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <RadioGroup defaultValue="default">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="layout-default" />
                      <Label htmlFor="layout-default">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="layout-compact" />
                      <Label htmlFor="layout-compact">Compact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expanded" id="layout-expanded" />
                      <Label htmlFor="layout-expanded">Expanded</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Notification Channels</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      defaultChecked={settings.notifications.email}
                      onChange={(e) =>
                        updateNotificationSettings({ ...settings.notifications, email: e.target.checked })
                      }
                    />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="push-notifications"
                      defaultChecked={settings.notifications.push}
                      onChange={(e) =>
                        updateNotificationSettings({ ...settings.notifications, push: e.target.checked })
                      }
                    />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-notifications"
                      defaultChecked={settings.notifications.sms}
                      onChange={(e) => updateNotificationSettings({ ...settings.notifications, sms: e.target.checked })}
                    />
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notification Types</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="account-activity"
                      defaultChecked={settings.notifications.accountActivity}
                      onChange={(e) =>
                        updateNotificationSettings({ ...settings.notifications, accountActivity: e.target.checked })
                      }
                    />
                    <Label htmlFor="account-activity">Account Activity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-features"
                      defaultChecked={settings.notifications.newFeatures}
                      onChange={(e) =>
                        updateNotificationSettings({ ...settings.notifications, newFeatures: e.target.checked })
                      }
                    />
                    <Label htmlFor="new-features">New Features and Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      defaultChecked={settings.notifications.marketing}
                      onChange={(e) =>
                        updateNotificationSettings({ ...settings.notifications, marketing: e.target.checked })
                      }
                    />
                    <Label htmlFor="marketing">Marketing and Promotions</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select
                  value={settings.notifications.frequency}
                  onValueChange={(value) => updateNotificationSettings({ ...settings.notifications, frequency: value })}
                >
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-hours-start">Quiet Hours</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Input id="quiet-hours-start" type="time" defaultValue="22:00" className="w-full sm:w-auto" />
                  <span className="hidden sm:inline">to</span>
                  <span className="inline sm:hidden">to</span>
                  <Input id="quiet-hours-end" type="time" defaultValue="07:00" className="w-full sm:w-auto" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy and data settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Sharing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics-sharing">Share analytics data</Label>
                      <Switch
                        id="analytics-sharing"
                        checked={settings.privacy.analyticsSharing}
                        onChange={(e) =>
                          updatePrivacySettings({ ...settings.privacy, analyticsSharing: e.target.checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalized-ads">Allow personalized ads</Label>
                      <Switch
                        id="personalized-ads"
                        checked={settings.privacy.personalizedAds}
                        onChange={(e) =>
                          updatePrivacySettings({ ...settings.privacy, personalizedAds: e.target.checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Visibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={settings.privacy.visibility}
                      onValueChange={(value) => updatePrivacySettings({ ...settings.privacy, visibility: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="visibility-public" />
                        <Label htmlFor="visibility-public">Public</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="visibility-private" />
                        <Label htmlFor="visibility-private">Private</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={settings.privacy.dataRetention}
                      onValueChange={(value) => updatePrivacySettings({ ...settings.privacy, dataRetention: value })}
                    >
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select Data Retention Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Third-Party Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">Connected: Google Analytics, Facebook Pixel</p>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Manage Integrations
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  Download Your Data
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete My Account
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSavePrivacy} className="w-full sm:w-auto">
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
