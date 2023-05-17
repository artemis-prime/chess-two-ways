import React from 'react'
import { observer } from 'mobx-react-lite'

import { useGame } from '~/services'
import { Row, Column, DashText } from '~/primatives'

import SideSwatch from './SideSwatch'

const GameStatusIndicator: React.FC = observer(() => {

  const game = useGame()

  return game.gameStatus.victor ? (
    <Column css={{ mb: '$single'}}>
      {game.gameStatus.victor === 'none' ? (<>
        <DashText css={{mb: '$half'}}>
          It's a draw!
          <DashText size='smaller' css={{pl: '$single'}}>{game.gameStatus.state === 'stalemate' ? ' (stalemate)' : ' (agreement)'}</DashText>
        </DashText> 
        <Row align='center'>
          <SideSwatch small side='white' />
          <DashText size='larger' css={{px: '$singleAndHalf'}}>=</DashText>
          <SideSwatch small side='black' />
          {game.gameStatus.state === 'stalemate' && <DashText css={{px: '$singleAndHalf'}}>, $</DashText>}
        </Row> 
      </>) : (<>
        <Row align='center'>
          <SideSwatch small side={game.gameStatus.victor}/>
          <DashText css={{ml: '$single'}}>won!</DashText>
          <DashText size='smaller' css={{pl: '$single'}}>{game.gameStatus.state === 'checkmate' ? '(checkmate)' : '(concession)'}</DashText>
        </Row>
        <DashText size='smaller'>{game.gameStatus.victor === 'white' ? '1-0' : '0-1'}{game.gameStatus.state === 'checkmate' ? ', #' : ', con.'}</DashText> 
      </>)}
    </Column>
  ) : null
})

export default GameStatusIndicator
