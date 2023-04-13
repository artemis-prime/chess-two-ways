import React, { useState } from 'react'
import { 
  View,
  StyleProp, 
  ViewStyle,
  LayoutChangeEvent 
} from 'react-native'

import { styled } from '~/stitches.config'

import { 
  type Piece, 
  type Position,
  RANKS,
  FILES,
  layoutPositionToPosition
} from '@artemis-prime/chess-core'

import BGImage from '~/primatives/BGImage'
import { useGame } from '~/board/GameProvider'
import { useChessDnD } from './ChessDragAndDrop'
import DraggingPieceComponent from './DraggingPiece'
import SquareComponent from './Square'

const imagePath = require('~assets/American-Hard-Maple.jpg')

const BoardInner = styled(View, {
  aspectRatio: 1,
  width: '100%',
  backgroundColor: 'transparent', // needed for gestures to work on android
})

const SquaresOuter = styled(View, {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  borderWidth: 1,
  position: 'relative',
  borderColor: '$boardSquareBrown', 
  backgroundColor: 'transparent', // needed for gestures to work on android
})


const Board: React.FC<{  
  style?: StyleProp<ViewStyle>
}> = ({
  style 
}) => {

  const game = useGame()
  const [boardSize, setBoardSize] = useState<number | null>(null)

  const whiteOnBottom = true // TODO.  

  const {
    onLayout: dndOnLayout,
    getSquaresDnDStatus,
    payload,
    touchOffest,
  } = useChessDnD(
    {
      numColumns: RANKS.length,
      numRows: FILES.length,
      rowAndColumnToPosition: (row: number, column: number): Position => 
        (layoutPositionToPosition(row, column, !whiteOnBottom))
    }
  )

  const onLayout = (e: LayoutChangeEvent): void  => {

    const {nativeEvent: { layout: {width}}} = e;
    setBoardSize(width)
    dndOnLayout(e)
  }

  return (
    <BoardInner style={style}  collapsable={false}>
      <BGImage imagePath={imagePath}  >
        <SquaresOuter onLayout={onLayout} >
        {game.getBoardAsArray(whiteOnBottom).map((sq: {pos: Position, piece: Piece | null}) => (
          <SquareComponent 
            position={sq.pos} 
            piece={sq.piece} 
            status={getSquaresDnDStatus(sq.pos)}
            size={boardSize === null ? '12.5%' : boardSize! / 8 }
            key={`key-${sq.pos.rank}-${sq.pos.file}`} 
          />
        ))}
        </SquaresOuter>
      </BGImage>
      {payload && touchOffest && (
        <DraggingPieceComponent piece={payload.piece} size={boardSize === null ? 35 : boardSize! * .85 / 8} x={touchOffest.x} y={touchOffest.y} />
      )} 
    </BoardInner>
  )
}

export default Board
