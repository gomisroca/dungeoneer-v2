import { type Source as SourceType } from '@prisma/client'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'
import { useSignal, useSignalEffect } from '@preact-signals/safe-react'

function Source({ source }: { source: SourceType }) {
  const isOpen = useSignal(false);
  const triggerRef = useRef<HTMLButtonElement>(null)

  useSignalEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        isOpen.value = false
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleTriggerClick = () => {
    isOpen.value = !isOpen.value
  }

  return (
    <div className='flex flex-row gap-2'>
      <TooltipProvider>
        <Tooltip open={isOpen.value} onOpenChange={() => isOpen.value = !isOpen.value}>
          <TooltipTrigger
            ref={triggerRef}
            onClick={handleTriggerClick}
            className='cursor-pointer focus:outline-none'
          >
            <Image
              src={`/sources/${source.type}.png`}
              alt={source.type}
              width={50}
              height={50}
              className='hover:scale-110 transition duration-200 ease-in-out hover:contrast-125 h-12 object-contain'
            />
          </TooltipTrigger>
          <TooltipContent
            side="top" 
            align="center"
            className="max-w-[280px] sm:max-w-[320px] break-words text-sm p-2 z-50">
            <p>{source.text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Source