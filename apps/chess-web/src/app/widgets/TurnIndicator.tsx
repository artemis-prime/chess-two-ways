import React from 'react'
import { observer } from 'mobx-react-lite'

import type { CSS } from '@stitches/react'
import { styled } from '~/styles/stitches.config'

import { useGame } from '~/services'
import SideSwatch from './SideSwatch'

const InnerView = styled('div', {

})

const TurnIndicator: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const game = useGame()

  return (
    <InnerView className='turn-indicator' css={css}>
      <SideSwatch side={game.currentTurn}/>
      <span className='label'>'s turn</span> 
    </InnerView>
  )
})

export default TurnIndicator
