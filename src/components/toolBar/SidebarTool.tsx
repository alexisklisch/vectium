import { ReactNode, useState, useRef, useEffect } from 'react'

type ToolsOptions = ([] | ReactNode[] | ReactNode)[]

export function SidebarTool ({ tools }: { tools: ToolsOptions }) {
  const [position, setPosition] = useState({ x: 20, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const sidebarRef = useRef<HTMLDivElement>(null)

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
      className='flex flex-col gap-3 w-min px-1.5 py-12 rounded-md absolute cursor-move shadow-lg'
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
              <div key={`group-${index}`} className='flex gap-0.5 [flex-direction:inherit]'>
                {element.map((el: ReactNode, innerIndex) => (
                  <div key={`item-${index}-${innerIndex}`}>
                    {el}
                  </div>
                ))}
              </div>
            )
          }
          // Si no es un array, solo devuelve el elemento
          return (
            <div key={`item-${index}`} className='flex gap-1'>
              {element}
            </div>
          )
        })
      }
    </aside>
  )
}
