import React from 'react'
import ReactDOM from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import GameProvider from '~/board/GameProvider'
import UIStateProvider from '~/board/UIState'

import UI from './UI'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <GameProvider >
      <UIStateProvider >
        <DndProvider backend={HTML5Backend}>
          <UI />
        </DndProvider>
      </UIStateProvider>
    </GameProvider>
  </React.StrictMode>
)

