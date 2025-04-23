import { isValidElement, ReactNode } from 'react'

type ToolsOptions = ([] | ReactNode[] | ReactNode)[]
export function SidebarTool ({ tools }: { tools: ToolsOptions }) {
  return (
    <aside
      className='flex flex-col gap-3 w-min px-1.5 py-12 rounded-md'
      style={{
        backgroundImage: 'url(/api/grainy)',
        backgroundSize: 'cover'
      }}
    >
      {
        tools.map(element => {
          // Crea divs cada vez que es un array
          if (Array.isArray(element)) {
            return (
              <div key={isValidElement(element[0]) ? element[0].key : undefined} className='flex gap-0.5 [flex-direction:inherit]'>
                {element.map((el: ReactNode) => el)}
              </div>
            )
          }
          // Si no es un array, solo devuelve el elemento
          return (
            <div key={isValidElement(element) ? element.key : undefined} className='flex gap-1'>
              {element}
            </div>
          )
        })
      }
    </aside>
  )
}
