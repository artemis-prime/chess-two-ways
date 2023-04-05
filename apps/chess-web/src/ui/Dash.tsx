  // @ts-ignore
import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { styled } from '~/styles/stitches.config'


import { useGame } from '~/board/GameProvider'

import { Button, Flex } from '~/primitives'

import Messages from './Messages'
import TurnIndicator from './TurnIndicator'
import UndoRedo from './UndoRedo'
import ShowMovesSwitch from './ShowMovesSwitch'

const MyLabel = styled('label', {

  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  },

  '& input[type="file"]': {
    display: 'none'
  }

})

const FileInputButton: React.FC = () => {

  const game = useGame()

  const readFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target?.result)
      if (text && typeof text === 'string') {
        const g: any = JSON.parse(text as string)
        if (g.artemisPrimeChessFile) {
          game.resetFromGameObject(g)
        }
      }
      else {
        console.log('Chess: File parse error')
      }
    };
    reader.readAsText((e.target as any).files[0])
  }


  return (
    <MyLabel className="custom-file-upload">
      <input type="file" onChange={readFile}/>
      file
    </MyLabel>
  )
}


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
        <Flex direction='row' justify='end'>
          <Button onClick={game.checkStalemate.bind(game)}>stalemate?</Button>&nbsp;I&nbsp;
          <FileInputButton />
        </Flex>
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
