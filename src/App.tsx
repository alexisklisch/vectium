import './App.css'
import { SidebarTool } from './components/toolBar/SidebarTool'
import { ToolButton } from './components/toolBar/ToolButton'

function App () {
  return (
    <>
      <SidebarTool
        tools={[
          [
            <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
            <ToolButton key='node-selection' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />
          ],
          [
            <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
            <ToolButton key='node-selection' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />,
            <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
            <ToolButton key='node-selection' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />
          ],
          [
            <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
            <ToolButton key='selection' name='Selection' imgPath='/imgs/icons/mouse-pointer.svg' />,
            <ToolButton key='node-selection' name='Node selection' imgPath='/imgs/icons/mouse-pointer-2.svg' />
          ],
        ]}
      />
    </>
  )
}

export default App
