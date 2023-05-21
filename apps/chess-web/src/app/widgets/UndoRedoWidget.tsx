import React from 'react'
import { observer } from 'mobx-react-lite'

import { common, type CSS, type MediaQuery } from '~/style'
import { useGame } from '~/services'
import { Button, Flex, ResponsiveText } from '~/primatives'

const ALT_TRIGGERS = [
  'allMobile', 
  'deskSmallest',  
  'deskPortrait',
] as MediaQuery[]

const MAIN_TRIGGERS = [
  'menuBreak', 
  'tabletLargePortrait'
] as MediaQuery[]


const UndoRedoWidget: React.FC<{ 
  css?: CSS
 }> = observer(({
  css,
}) => {

  const game = useGame()

  return (
    <Flex direction='row' justify='start' align='stretch' css={css}>
      <Button 
        menu
        disabled={!game.canUndo}
        onClick={game.undo}
        css={{...common.menuBarTrigger, px: '$2'}}
      >
        <ResponsiveText 
          main='Undo' 
          alt={'\u2039'} 
          altTriggers={ALT_TRIGGERS} 
          mainTriggers={MAIN_TRIGGERS}
          css={{ fontFamily: common.menuBarTrigger.fontFamily }}
        />
      </Button>
      <Button 
        menu
        disabled={!game.canRedo}
        onClick={game.redo}
        css={{...common.menuBarTrigger, px: '$2'}}
      >
        <ResponsiveText 
          main='Redo' 
          alt={'\u203A'} 
          altTriggers={ALT_TRIGGERS} 
          mainTriggers={MAIN_TRIGGERS}
          css={{ fontFamily: common.menuBarTrigger.fontFamily }}
        />
      </Button>
    </Flex>
  )
})

export default UndoRedoWidget
