  // @ts-ignore
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Board from '~/core/Board'
import GameProvider from '~/core/GameProvider'
import { VisualFeedbackProvider } from '~/core/VisualFeedback'

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
            <h1 className="app-header-text">Chess Three Ways (web souffl&eacute;)</h1>
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
