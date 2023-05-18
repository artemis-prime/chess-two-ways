import React from 'react'
import { observer } from 'mobx-react-lite'
import type { CSS } from '@stitches/react'

import { useGame } from '~/services'

import { Button, type ButtonSize, Flex } from '~/primatives'
  
const UndoRedoWidget: React.FC<{ 
  menu?: boolean
  dash?: boolean
  strings: string[],
  buttonSize: ButtonSize,
  css?: CSS
 }> = observer(({
  menu = false,
  dash = true,
  buttonSize,
  css,
  strings
}) => {

  const game = useGame()

  return (
    <Flex direction='row' justify='start' align='center' css={css}>
      <Button 
        menu={menu ?? false}
        dash={dash ?? false}
        size={buttonSize}  
        disabled={!game.canUndo}
        onClick={game.undo}
      >{strings[0]}</Button>
      {strings[2] ? ((game.canUndo || game.canRedo) ? strings[2] : <span style={{paddingRight: '0.5rem'}} />) : null}
      <Button 
        menu={menu ?? false}
        dash={dash ?? false}
        size={buttonSize}   
        disabled={!game.canRedo}
        onClick={game.redo}
      >{strings[1]}</Button>
    </Flex>
  )
})

export default UndoRedoWidget
