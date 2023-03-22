  // @ts-ignore
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from '~/board/Board'
import GameProvider from '~/board/GameProvider'
import { VisualFeedbackProvider } from '~/board/VisualFeedback'

import { Flex } from '~/primitives'

import Dash from './Dash'

import '~/styles/fonts.scss'
import '~/styles/main.scss'

const App: React.FC<{}> = () => (
  <GameProvider >
    <VisualFeedbackProvider >
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <header className="app-header">
            <h1 className="app-header-text">Chess Three Ways - Web Souffl&eacute;</h1>
          </header>
          <main>
            <Flex direction='row' align='center'>
              <Board />
              <Dash />
            </Flex>
          </main>
        </div>
      </DndProvider>
    </VisualFeedbackProvider>
  </GameProvider>
)

export default App
