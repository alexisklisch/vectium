import { useState } from 'react'

export function ToolButton ({ imgPath, name }: { imgPath: string, name: string }) {
  const [isSelected, setIsSelected] = useState(false)

  const stateStyles: React.CSSProperties = isSelected
    ? {
        backgroundImage: `url(${imgPath})`,
        backgroundSize: 21,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        mixBlendMode: 'lighten',
      }
    : {
        maskImage: `url(${imgPath})`,
        maskSize: 21
      }

  return (
    <div className={`flex rounded-md border overflow-hidden border-transparent transition duration-300 ${!isSelected ? 'hover:border-white/15' : ''}`}>
      <button
        className='size-9 bg-white mask-no-repeat mask-center cursor-pointer active:outline-none'
        style={stateStyles}
        title={name}
        onClick={() => setIsSelected(!isSelected)}
      />
    </div>
  )
}
