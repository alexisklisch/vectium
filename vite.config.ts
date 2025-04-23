import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwind from '@tailwindcss/vite'

const GrainyPlugin: Plugin = {
  name: 'grainy-plugin',
  configureServer (server) {
    server.middlewares.use('/api/grainy', (req: any, res: any) => {
      // Obtener parámetros de la URL
      const url = new URL(req.url, `http://${req.headers.host}`)

      // Parámetros con valores predeterminados
      const width = parseInt(url.searchParams.get('width') || '800')
      const height = parseInt(url.searchParams.get('height') || '600')
      const blurLevel = parseInt(url.searchParams.get('blur') || '34')
      const noiseOpacity = parseFloat(url.searchParams.get('noise') || '0.07')
      const noiseScale = parseFloat(url.searchParams.get('noiseScale') || '0.7')

      // Colores por defecto si no se especifican
      const defaultColors = ['#03A592', '#556EA8', '#8744A0']

      // Obtener colores de los parámetros
      let colors = []
      const colorParams = url.searchParams.getAll('color')

      if (colorParams.length >= 2) {
        colors = colorParams
      } else {
        colors = defaultColors
      }

      // Generar ID único para los filtros
      const uniqueId = Date.now().toString(36)

      // Crear formas aleatorias para los degradados
      const generateRandomShape = () => {
        const types = ['radialGradient', 'linearGradient']
        const type = types[Math.floor(Math.random() * types.length)]

        if (type === 'radialGradient') {
          // Posiciones aleatorias para el centro del degradado radial
          const cx = Math.random() * 100
          const cy = Math.random() * 100
          const r = 50 + Math.random() * 100

          return `
            <radialGradient id="gradient-${uniqueId}" cx="${cx}%" cy="${cy}%" r="${r}%" fx="${cx * 0.8 + 10}%" fy="${cy * 0.8 + 10}%">
              ${colors.map((color, index) =>
                `<stop offset="${(index * 100) / (colors.length - 1)}%" stop-color="${color}" />`
              ).join('')}
            </radialGradient>
          `
        } else {
          // Ángulos aleatorios para el degradado lineal
          const x1 = Math.random() * 100
          const y1 = Math.random() * 100
          const x2 = Math.random() * 100
          const y2 = Math.random() * 100

          return `
            <linearGradient id="gradient-${uniqueId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
              ${colors.map((color, index) =>
                `<stop offset="${(index * 100) / (colors.length - 1)}%" stop-color="${color}" />`
              ).join('')}
            </linearGradient>
          `
        }
      }

      // Generar filtro de ruido más visible
      const noiseFilter = `
        <filter id="noise-${uniqueId}">
          <feTurbulence type="fractalNoise" baseFrequency="${noiseScale}" numOctaves="4" seed="${Math.floor(Math.random() * 500)}" result="noise"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${noiseOpacity * 3} 0" result="noiseBrighter"/>
          <feComposite operator="in" in="noiseBrighter" in2="SourceGraphic" result="noiseVisible"/>
        </filter>
      `

      // Filtro de desenfoque con expansión para evitar efectos de borde
      const blurFilter = `
        <filter id="blur-${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="${blurLevel}" />
        </filter>
      `

      // Generar algunas formas adicionales aleatorias
      const generateRandomBlobs = () => {
        const blobs = []
        const numBlobs = 2 + Math.floor(Math.random() * 3)

        for (let i = 0; i < numBlobs; i++) {
          const blobSize = 100 + Math.floor(Math.random() * 300)
          const x = -50 + Math.random() * (width + 100)
          const y = -50 + Math.random() * (height + 100)
          const opacity = 0.1 + Math.random() * 0.3
          const rotation = Math.random() * 360

          blobs.push(`
            <circle cx="${x}" cy="${y}" r="${blobSize}" 
                    fill="url(#gradient-${uniqueId})"
                    opacity="${opacity}"
                    transform="rotate(${rotation} ${x} ${y})"
                    filter="url(#blur-${uniqueId})" />
          `)
        }

        return blobs.join('')
      }

      // Crear SVG con degradado y efecto granulado mejorado, y sin efecto de borde luminoso
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
          <defs>
            ${generateRandomShape()}
            ${blurFilter}
            ${noiseFilter}
            <clipPath id="clip-${uniqueId}">
              <rect x="0" y="0" width="${width}" height="${height}" />
            </clipPath>
          </defs>
          
          <g clip-path="url(#clip-${uniqueId})">
            <!-- Base con padding extendido para eliminar el efecto de borde -->
            <rect x="-50" y="-50" width="${width + 100}" height="${height + 100}" fill="url(#gradient-${uniqueId})" filter="url(#blur-${uniqueId})" />
            ${generateRandomBlobs()}
            <rect width="${width}" height="${height}" fill="#000" filter="url(#noise-${uniqueId})" opacity="1" mix-blend-mode="overlay" />
          </g>
        </svg>
      `

      res.statusCode = 200
      res.setHeader('Content-Type', 'image/svg+xml')
      res.end(svg)
    })
  }
}

export default defineConfig({
  plugins: [react(), tailwind(), GrainyPlugin],
})
