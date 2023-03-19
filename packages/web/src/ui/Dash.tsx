  // @ts-ignore
import React from 'react'
import { observer } from 'mobx-react'

import { useGame } from '~/board/GameProvider'

import {
  Button,
  Flex,
  Text
} from '~/primitives'

const Dash: React.FC<{}> = observer(() => {

  const game = useGame()

  return (
    <div className='dash'>
      <Text>Dash</Text>
      <Flex direction='row' align='center'>
        <Button 
          variant='containedColor'
          size='large'  
          disabled={!game.canUndo}
          onClick={game.undo.bind(game)}
        >Undo</Button>
        <Button 
          variant='containedColor'
          size='large'  
          disabled={!game.canRedo}
          onClick={game.redo.bind(game)}
        >Redo</Button>
      </Flex>
    </div>
  )
})

export default Dash
