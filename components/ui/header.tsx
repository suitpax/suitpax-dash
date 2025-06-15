import type React from "react"

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </header>
  )
}

export default Header
