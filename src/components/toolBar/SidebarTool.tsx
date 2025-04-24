import { ReactNode, useState, useRef, useEffect } from 'react'
import { useStore } from '../../utils/state'

type ToolsOptions = ([] | ReactNode[] | ReactNode)[]

export function SidebarTool ({ tools }: { tools: ToolsOptions }) {
  const { device } = useStore()
  const [position, setPosition] = useState({ x: 20, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(device === 'mobile' ? 'horizontal' : 'vertical')

  // Update direction based on device type
  useEffect(() => {
    if (device === 'mobile') {
      setDirection('horizontal')
    } else {
      setDirection('vertical')
    }
  }, [device])

  // Función para centrar verticalmente el sidebar
  const centerVertically = () => {
    if (sidebarRef.current && typeof window !== 'undefined') {
      const windowHeight = window.innerHeight
      const sidebarHeight = sidebarRef.current.offsetHeight
      const newY = Math.max(0, (windowHeight - sidebarHeight) / 2)
      setPosition(prev => ({ ...prev, y: newY }))
    }
  }

  // Centrar verticalmente al inicio y cuando cambia el tamaño de la ventana
  useEffect(() => {
    centerVertically()
    window.addEventListener('resize', centerVertically)
    return () => window.removeEventListener('resize', centerVertically)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (sidebarRef.current) {
      setIsDragging(true)
      const rect = sidebarRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // Mantener la posición Y fija para que siempre esté en el centro
      setPosition({
        x: Math.max(20, e.clientX - dragOffset.x),
        y: position.y // Mantener la posición Y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <aside
      ref={sidebarRef}
      className={`flex ${direction === 'vertical' ? 'flex-col py-12' : 'px-12'} gap-3 w-min px-1.5 rounded-md absolute cursor-move shadow-lg`}
      style={{
        backgroundImage: 'url(/api/grainy)',
        backgroundSize: 'cover',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        userSelect: 'none',
        transition: isDragging ? 'none' : 'box-shadow 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      {
        tools.map((element, index) => {
          // Crea divs cada vez que es un array
          if (Array.isArray(element)) {
            return (
              <div
                key={`tool-group-${index}`}
                className='flex gap-0.5 [flex-direction:inherit]'
              >
                {element}
              </div>
            )
          }
          // Si no es un array, solo devuelve el elemento
          return (
            <div
              key={`tool-item-${index}`}
              className='flex gap-1'
            >
              {element}
            </div>
          )
        })
      }
    </aside>
  )
}
