  // @ts-ignore
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from '~/core/Board'
import GameProvider from '~/core/GameProvider'
import { FeedbackProvider } from '~/core/Feedback'

import Dash from './Dash'

import '~/styles/main.scss'

const App: React.FC<{}> = () => (
  <GameProvider >
    <FeedbackProvider >
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <header className="app-header">
            <span className="app-header-text">Chess Demo</span>
          </header>
          <main>
            <Board />
            <Dash />
          </main>
        </div>
      </DndProvider>
    </FeedbackProvider>
  </GameProvider>
)

export default App
