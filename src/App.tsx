import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from './components/Board'
import GameServiceProvider from './domain/GameServiceProvider'

import './App.scss'

const App: React.FC<{}> = () => (
  <GameServiceProvider >
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header className="App-header">
          <span className="App-header-text">Pawns only chess</span>
        </header>
        <Board />
      </div>
    </DndProvider>
  </GameServiceProvider>
)

export default App
