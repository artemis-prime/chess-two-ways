import React from 'react'
import { observer } from 'mobx-react-lite'

import { useGame } from '~/services'

import { Button, Flex, ResponsiveText } from '~/primatives'
import { common, type CSS } from '~/styles/stitches.config'

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
        size='large' 
        disabled={!game.canUndo}
        onClick={game.undo}
        css={{...common.menuBarTrigger, px: '$2'}}
      >
        <ResponsiveText 
          main='Undo' 
          alt={'\u2039'} 
          altTriggers={['allMobile', 'desktopSmall']} 
          css={{ fontFamily: common.menuBarTrigger.fontFamily }}/>
      </Button>
      <Button 
        menu
        size='large' 
        disabled={!game.canRedo}
        onClick={game.redo}
        css={{...common.menuBarTrigger, px: '$2'}}
      >
        <ResponsiveText 
          main='Redo' 
          alt={'\u203A'} 
          altTriggers={['allMobile', 'desktopSmall']} 
        />
      </Button>
    </Flex>
  )
})

export default UndoRedoWidget
