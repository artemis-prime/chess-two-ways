  // @ts-ignore
import React, { PropsWithChildren } from 'react'

import Board from '~/board/Board'

import { Box, Flex, FlexMain } from '~/primitives'

import Dash from './Dash'

import '~/styles/fonts.scss'
import '~/styles/main.scss'

const Side: React.FC<PropsWithChildren> = ({children}) => (
  <Box css={{
    flex: '1 1 0', 
    //border: '3px solid green',
  }}>
    {children}
  </Box>
)

const UI: React.FC<{}> = () => (
  <div className="App">
    <header className="app-header">
      <h1 className="app-header-text">Chess Three Ways - Web Souffl&eacute;</h1>
    </header>
    <FlexMain direction='row' align='stretch' justify='center' css={{ 
      width: '100vw',
      //border: '1px solid red',
      height: '92vh'
    }}>
      <Side />
      <Flex justify='center' align='center' css={{/*border: '1px solid blue',*/ flex: '2 0 0'}} >
        <Board />
      </Flex>
      <Side >
      <Dash />
      </Side>
      {/*<Dash />*/}
    </FlexMain>
  </div>
)

export default UI
