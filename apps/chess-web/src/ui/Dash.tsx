  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import { Button, Flex } from '~/primitives'

import Messages from './Messages'
import TurnIndicator from './TurnIndicator'
import UndoRedo from './UndoRedo'

const Dash: React.FC<{}> = observer(() => {

  const game = useGame()

  return (
    <div className='dash'>
      <Flex direction='row' justify='between' align='center'>
        <TurnIndicator />
        <Button onClick={game.concede.bind(game)}>concede</Button>
      </Flex>
      <UndoRedo />
      <Messages />
    </div>
  )
})

export default Dash
