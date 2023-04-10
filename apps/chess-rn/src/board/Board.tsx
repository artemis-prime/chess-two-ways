import React from 'react'
import { 
  View,
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled, useTheme } from '~/stitches.config'

import type { Piece, Position } from '@artemis-prime/chess-core'

import BGImage from '~/primatives/BGImage'
import { useGame } from '~/board/GameProvider'

import SquareComponent from './Square'

const imagePath = require('~assets/American-Hard-Maple.jpg')

const BoardInner = styled(View, {
  aspectRatio: 1,
  width: '100%',
  shadow: 'medium'

})

const SquaresOuter = styled(View, {
  aspectRatio: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  borderWidth: 1,
  borderColor: '$boardSquareBrown' 
})


const Board: React.FC<{  
  style?: StyleProp<ViewStyle>
}> = ({
  style 
}) => {
  const game = useGame()
  const theme = useTheme()

  const whiteOnBottom = true
  return (
    <BoardInner style={style}>
      <BGImage imagePath={imagePath}>
        <SquaresOuter >
        {game.getBoardAsArray(whiteOnBottom).map((sq: {pos: Position, piece: Piece | null}) => (
          <SquareComponent position={sq.pos} piece={sq.piece} key={`key-${sq.pos.rank}-${sq.pos.file}`} />
        ))}
        </SquaresOuter>
      </BGImage>
    </BoardInner>
  )
}

export default Board
