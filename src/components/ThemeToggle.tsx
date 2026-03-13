'use client'

import { useTheme } from 'next-themes'
import { IconSunFilled, IconMoonFilled } from '@tabler/icons-react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-lg transition">
      {theme === 'light' ? <IconMoonFilled size={20} className="text-blue-800" /> : <IconSunFilled size={20} className="text-[#FFDF00]" />}
    </button>
  )
}
