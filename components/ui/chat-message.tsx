import Image from "next/image"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-black border border-white/10 flex items-center justify-center">
          <Image
            src="/ai-agents/agent-3.jpeg"
            alt="Suitpax AI"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
        </div>
      )}
      <div
        className={`${
          message.role === "user"
            ? "bg-white/10 text-white rounded-lg rounded-tr-none"
            : "bg-black border border-white/10 p-2 rounded-xl rounded-tl-none"
        } max-w-[80%] p-3`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
      {message.role === "user" && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
          <Image src="/images/user-avatar.jpg" alt="User" width={32} height={32} className="h-8 w-8 object-cover" />
        </div>
      )}
    </div>
  )
}
