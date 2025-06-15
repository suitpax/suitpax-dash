"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Send, Paperclip, Mic, Command, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AIAgent {
  id: string
  name: string
  specialty: string
  avatar: string
  color: string
}

interface AnimatedChatInputProps {
  onSubmit: (message: string, attachments?: string[]) => void
  isLoading: boolean
  placeholder?: string
  selectedAgent: AIAgent
}

interface CommandSuggestion {
  icon: React.ReactNode
  label: string
  description: string
  prefix: string
}

const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Create Task",
    description: "Create a new task automatically",
    prefix: "/task",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Book Flight",
    description: "Search and book flights",
    prefix: "/flight",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Expense Report",
    description: "Generate expense report",
    prefix: "/expense",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Travel Policy",
    description: "Check travel policy compliance",
    prefix: "/policy",
  },
]

export function AnimatedChatInput({ onSubmit, isLoading, placeholder, selectedAgent }: AnimatedChatInputProps) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true)
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value))
      setActiveSuggestion(matchingSuggestionIndex >= 0 ? matchingSuggestionIndex : -1)
    } else {
      setShowCommandPalette(false)
    }
  }, [value])

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    const newHeight = Math.max(60, Math.min(textarea.scrollHeight, 200))
    textarea.style.height = `${newHeight}px`
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1))
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault()
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion]
          setValue(selectedCommand.prefix + " ")
          setShowCommandPalette(false)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowCommandPalette(false)
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim(), attachments.length > 0 ? attachments : undefined)
      setValue("")
      setAttachments([])
      adjustHeight()
    }
  }

  const handleAttachFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const fileNames = files.map((file) => file.name)
    setAttachments((prev) => [...prev, ...fileNames])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 right-0 backdrop-blur-xl bg-black/90 rounded-lg shadow-lg border border-white/10 overflow-hidden"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="py-1">
              {commandSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.prefix}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm transition-colors cursor-pointer",
                    activeSuggestion === index ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
                  )}
                  onClick={() => {
                    setValue(suggestion.prefix + " ")
                    setShowCommandPalette(false)
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-white/60">{suggestion.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.label}</div>
                    <div className="text-xs text-white/40">{suggestion.description}</div>
                  </div>
                  <div className="text-xs text-white/30">{suggestion.prefix}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
        animate={{
          borderColor: isFocused ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
          backgroundColor: isFocused ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.02)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              className="px-4 pt-3 flex gap-2 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Paperclip className="w-3 h-3" />
                  <span>{file}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              adjustHeight()
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || "Ask Suitpax AI anything..."}
            disabled={isLoading}
            className={cn(
              "w-full px-0 py-0 resize-none bg-transparent border-none text-white/90 text-sm",
              "focus:outline-none placeholder:text-white/30 min-h-[60px] max-h-[200px]",
            )}
            style={{ height: "60px" }}
          />
        </div>

        <div className="px-4 pb-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleAttachFile}
              whileTap={{ scale: 0.94 }}
              className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowCommandPalette(!showCommandPalette)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                showCommandPalette && "bg-white/10 text-white/90",
              )}
            >
              <Command className="w-4 h-4" />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
            >
              <Mic className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !value.trim()}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              value.trim() && !isLoading
                ? `bg-gradient-to-r ${selectedAgent.color} text-white shadow-lg`
                : "bg-white/[0.05] text-white/40",
            )}
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </motion.button>
        </div>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.csv,.xlsx"
      />
    </div>
  )
}
