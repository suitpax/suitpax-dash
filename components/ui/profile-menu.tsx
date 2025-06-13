"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface ProfileMenuProps {
  name?: string
  role?: string
  avatar: string
  company?: string
  subscription?: string
}

// Cambiar el objeto defaultProfile para actualizar el nombre y la imagen por defecto
const defaultProfile = {
  name: "Alberto Zurano",
  role: "Travel Manager",
  company: "Acme Corp",
  avatar: "/images/ai-agent-avatar.jpeg", // Usar la imagen del AI agent como predeterminada
  subscription: "Business Premium",
} satisfies Required<ProfileMenuProps>

export default function ProfileMenu({
  name = defaultProfile.name,
  role = defaultProfile.role,
  company = defaultProfile.company,
  avatar = defaultProfile.avatar,
  subscription = defaultProfile.subscription,
}: Partial<ProfileMenuProps> = defaultProfile) {
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

  // Update the component props to use userProfile data:
  const profileData = {
    name: userProfile?.firstName + " " + userProfile?.lastName || defaultProfile.name,
    role: userProfile?.jobTitle || defaultProfile.role,
    company: userProfile?.companyName || defaultProfile.company,
    avatar: userProfile?.profileImage || defaultProfile.avatar,
    subscription: userProfile?.currentPlan || defaultProfile.subscription,
  }
  // Actualizar los elementos del menú
  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      external: false,
    },
    {
      label: "Company",
      value: company,
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Subscription",
      value: subscription,
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      external: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      external: true,
    },
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg">
        <div className="relative px-4 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            {/* Componente de imagen mejorado */}
            <div className="relative shrink-0">
              <Image
                src={profileData.avatar || defaultProfile.avatar}
                alt={profileData.name || defaultProfile.name}
                width={56}
                height={56}
                className="rounded-md ring-2 ring-white/10 object-cover w-[56px] h-[56px]"
                priority
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-black" />
            </div>

            {/* Profile Info - Más compacto */}
            <div className="flex-1">
              <h2 className="text-base font-medium text-white">{profileData.name}</h2>
              <p className="text-sm text-white/70">{profileData.role}</p>
            </div>
          </div>
          <div className="h-px bg-white/10 my-3" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-1.5 
              hover:bg-white/5 
              rounded-md transition-colors duration-200"
                aria-label={`Go to ${item.label}`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs font-medium text-white">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-xs text-white/70 mr-2">{item.value}</span>}
                  {item.external && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  )}
                </div>
              </Link>
            ))}

            {/* Botón de cerrar sesión actualizado */}
            <button
              type="button"
              className="w-full flex items-center justify-between p-1.5 
            hover:bg-white/5 
            rounded-md transition-colors duration-200"
              aria-label="Log out"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="text-xs font-medium text-white">Log out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
