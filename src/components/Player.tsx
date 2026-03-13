'use client'
//import { useState } from 'react'
import { usePlayer } from '@/lib/playerContext'
import { MiniControls } from './MiniControls'
import { MiniInfo } from './MiniInfo'
import { Button } from './ui/button'
import { IconChevronDown } from '@tabler/icons-react'
import NowPlaying from './shared/NowPlaying'

export const Player = () => {
  const player = usePlayer()
  if (!player) return null
  const { isMini, setIsMini } = player
  return (
    <div
      className="w-full fixed bottom-13 bg-background border-t p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-50"
      onClick={isMini ? () => setIsMini(false) : undefined}
      style={{ cursor: isMini ? 'pointer' : 'default' }}
    >

      {isMini ? (
        <div className="flex justify-between items-center w-full">
          <MiniInfo />
          <MiniControls />
        </div>
      ) : (
        <div className="fixed inset-0 w-full h-full z-50 bg-background md:static md:w-auto md:h-auto md:bg-transparent flex flex-col">
          <NowPlaying />
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation()
              setIsMini(true)
            }}
            className="absolute top-2 right-2 md:static"            
          >
            <IconChevronDown size={18} />
          </Button>          
        </div>
      )}
    </div>
  )
}
