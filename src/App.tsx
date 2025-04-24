import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import './App.css'
import { SidebarTool } from './components/toolBar/SidebarTool'
import { ToolButton } from './components/toolBar/ToolButton'
import { useEffect, useRef, type ReactNode } from 'react'
import { useStore } from './utils/state'

function App () {
  const { updateDevice, device } = useStore()
  const isInitialRender = useRef(true)

  const sidebar = (
    <SidebarTool
      key='sidebar-tools'
      tools={[
        [
          <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
          <ToolButton key='node-selection' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />
        ],
        [
          <ToolButton key='square-shape' name='Square shape' imgPath='/imgs/icons/square.svg' />,
          <ToolButton key='node-selection-2' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />,
          <ToolButton key='selection-2' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />
        ]
      ]}
    />
  )

  // Centro: inicialmente contiene el sidebar
  const [centerRef, centerItems] = useDragAndDrop<HTMLDivElement, ReactNode>(
    [sidebar],
    { group: 'sidebar', sortable: false, plugins: [] }
  )

  // Fondo: inicialmente vacío
  const [bottomRef, bottomItems] = useDragAndDrop<HTMLDivElement, ReactNode>(
    [],
    { group: 'sidebar', sortable: false }
  )

  // Determinar el device solo en el montaje inicial y en resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      updateDevice(isMobile ? 'mobile' : 'pc')
    }

    // Solo actualizamos en el montaje inicial
    if (isInitialRender.current) {
      handleResize()
      isInitialRender.current = false
    }

    // Agregamos el listener para cambios de tamaño de ventana
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateDevice])

  return (
    <main className='flex flex-col h-dvh'>
      <div className='flex flex-1 w-[10dvh] items-center justify-center' ref={centerRef}>
        {centerItems}
      </div>
      <div className='flex items-center h-[10dvh] justify-center' ref={bottomRef}>
        {bottomItems}
      </div>
    </main>
  )
}

export default App
