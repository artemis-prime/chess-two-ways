  // @ts-ignore
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from './Board'
import Dash from './Dash'
import GameProvider from './GameProvider'
import { FeedbackProvider } from './Feedback'

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
