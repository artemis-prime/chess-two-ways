import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from './components/Board'
import GameProvider from './domain/GameProvider'
import { FeedbackProvider } from './components/Feedback'

import './App.scss'

const App: React.FC<{}> = () => (
  <GameProvider >
    <FeedbackProvider >
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <header className="App-header">
            <span className="App-header-text">Pawns only chess</span>
          </header>
          <Board />
        </div>
      </DndProvider>
    </FeedbackProvider>
  </GameProvider>
)

export default App
