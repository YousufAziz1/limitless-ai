import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function CursorGlow() {
  const [isHovering, setIsHovering] = useState(false)
  const cursorX = useSpring(-100, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(-100, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen"
      style={{
        x: cursorX,
        y: cursorY,
        background: isHovering 
          ? 'radial-gradient(circle, rgba(255,107,26,0.8) 0%, rgba(255,107,26,0) 70%)' 
          : 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
        scale: isHovering ? 2.5 : 1,
      }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
    />
  )
}
