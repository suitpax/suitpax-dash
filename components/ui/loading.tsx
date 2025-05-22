"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="relative flex flex-col items-center justify-center">
        <Image
          src="/images/suitpax-cloud-logo.webp"
          alt="Suitpax Cloud"
          width={60}
          height={60}
          className="mb-3 opacity-90"
        />
        <p className="text-white/70 text-sm font-medium animate-pulse mt-2">Thinking...</p>
      </div>
    </div>
  )
}
