import { ReactNode, useEffect, useState } from 'react'
import { useStore } from '../../utils/state'

type ToolsOptions = ([] | ReactNode[] | ReactNode)[]
export function SidebarTool ({ tools }: { tools: ToolsOptions }) {
  const { device } = useStore()

  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(device === 'mobile' ? 'horizontal' : 'vertical')

  useEffect(() => {
    if (device === 'mobile') {
      setDirection('horizontal')
    } else {
      setDirection('vertical')
    }
  }, [device])

  console.log('La direccion es ', direction)
  return (
    <aside
      className={`flex ${direction === 'vertical' ? 'flex-col py-12' : 'px-12'} gap-3 w-min px-1.5 rounded-md`}
      style={{
        backgroundImage: 'url(/api/grainy)',
        backgroundSize: 'cover'
      }}
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
