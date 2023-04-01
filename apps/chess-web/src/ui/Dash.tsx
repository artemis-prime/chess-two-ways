  // @ts-ignore
import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import { Button, Flex } from '~/primitives'

import Messages from './Messages'
import TurnIndicator from './TurnIndicator'
import UndoRedo from './UndoRedo'
import ShowMovesSwitch from './ShowMovesSwitch'


const Dash: React.FC<{}> = observer(() => {

  const game = useGame()
  const [showMoves, setShowMoves] = useState<boolean>(false)

  const handleSetShowMoves = (checked: boolean) => {
    setShowMoves(checked)
  }

  return (
    <div className='dash'>
      <Flex direction='row' justify='between' align='center'>
        <TurnIndicator />
        <Button onClick={game.concede.bind(game)}>concede</Button>
      </Flex>
      <Flex direction='row' justify='between' align='center'>
        <UndoRedo />
        <ShowMovesSwitch checked={showMoves} onChange={handleSetShowMoves} />
      </Flex>
      <Messages showMoves={showMoves}/>
    </div>
  )
})

export default Dash
