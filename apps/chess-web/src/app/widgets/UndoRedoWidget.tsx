import React from 'react'
import { observer } from 'mobx-react-lite'
import type { CSS } from '@stitches/react'

import { useGame } from '~/services'

import { Button, type ButtonSize, Flex } from '~/primatives'
  
const UndoRedoWidget: React.FC<{ 
  buttonSize: ButtonSize,
  css?: CSS
 }> = observer(({
  buttonSize,
  css
}) => {

  const game = useGame()

  return (
    <Flex direction='row' justify='start' align='center' css={css}>
      <Button 
        size={buttonSize}  
        disabled={!game.canUndo}
        onClick={game.undo}
      >Undo</Button>
      &nbsp;{!(game.canUndo || game.canRedo) ? (<span style={{paddingRight: '2px'}} />) : '|'}&nbsp;
      <Button 
        size={buttonSize}   
        disabled={!game.canRedo}
        onClick={game.redo}
      >Redo</Button>
    </Flex>
  )
})

export default UndoRedoWidget
