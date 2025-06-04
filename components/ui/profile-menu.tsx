"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ProfileModal from "./profile-modal"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
  onClick?: () => void
}

interface ProfileMenuProps {
  name?: string
  role?: string
  avatar: string
  company?: string
  subscription?: string
}

const defaultProfile = {
  name: "Alberto Zurano",
  role: "Travel Manager",
  company: "Suitpax",
  avatar: "/images/ai-agent-avatar.jpeg",
  subscription: "Professional",
} satisfies Required<ProfileMenuProps>

export default function ProfileMenu({
  name = defaultProfile.name,
  role = defaultProfile.role,
  company = defaultProfile.company,
  avatar = defaultProfile.avatar,
  subscription = defaultProfile.subscription,
}: Partial<ProfileMenuProps> = defaultProfile) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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
      onClick: () => setIsProfileModalOpen(true),
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
      href: "/plans",
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
      href: "/settings",
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

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <div className="relative overflow-hidden rounded-xl border border-black">
          <div className="relative px-6 pt-12 pb-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative shrink-0">
                <Image
                  src={avatar || defaultProfile.avatar}
                  alt={name || defaultProfile.name}
                  width={72}
                  height={72}
                  className="rounded-full ring-4 ring-white object-cover w-[72px] h-[72px]"
                  priority
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-black ring-2 ring-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-medium tracking-tighter text-black">{name}</h2>
                <p className="text-gray-700">{role}</p>
              </div>
            </div>
            <div className="h-px bg-gray-300 my-6" />
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.onClick ? (
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center justify-between p-2 
                        hover:bg-gray-100 
                        rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-sm font-medium text-black">{item.label}</span>
                      </div>
                      <div className="flex items-center">
                        {item.value && <span className="text-sm text-gray-700 mr-2">{item.value}</span>}
                        {item.external && (
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
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between p-2 
                        hover:bg-gray-100 
                        rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-sm font-medium text-black">{item.label}</span>
                      </div>
                      <div className="flex items-center">
                        {item.value && <span className="text-sm text-gray-700 mr-2">{item.value}</span>}
                        {item.external && (
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
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="w-full flex items-center justify-between p-2 
                  hover:bg-gray-100 
                  rounded-lg transition-colors duration-200"
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
                    className="w-4 h-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className="text-sm font-medium text-black">Log out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
