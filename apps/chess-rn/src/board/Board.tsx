import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { 
  View,
  StyleProp, 
  ViewStyle,
  LayoutChangeEvent 
} from 'react-native'
import { type Piece, type Position } from '@artemis-prime/chess-core'

import { styled } from '~/conf/stitches.config'

import BGImage from '~/primatives/BGImage'
import { useGame } from '~/board/GameProvider'
import { useConfigChessDnD } from './ChessDnD'
import DraggingPiece from './DraggingPiece'
import SquareComponent from './Square'

const BoardInner = styled(View, {
  aspectRatio: 1,
  width: '100%',
  backgroundColor: 'transparent', // needed for gestures to work on android
  borderWidth: 2,
  borderRadius: 3,
  //borderColor: 'darkbrown',
  overflow: 'hidden', 
  borderColor: '$pieceBlack',
})

const SquaresOuter = styled(View, {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  position: 'relative',
  backgroundColor: 'transparent', // needed for gestures to work on android
})

const Board: React.FC<{ style?: StyleProp<ViewStyle> }> = observer(({
  style 
}) => {
  const whiteOnBottom = true // TODO: will be ui state soon :)

  const game = useGame()

    // Squares need to know their size in pt to do internal layout.
    // Instead of forcing each square listen for it's own size changes,
    // we optimize by doing it here and informing them of changes.
    // We are a simple 8x8 grid after all! :)
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined)
  const { layoutListener: layoutListenerDnd, setWhiteOnBottom } = useConfigChessDnD()

  useEffect(() => {
    setWhiteOnBottom(whiteOnBottom)
  }, [whiteOnBottom])

  const layoutListener = (e: LayoutChangeEvent): void  => {
    const {nativeEvent: { layout: {width}}} = e;
    setBoardSize(width)
    layoutListenerDnd(e)
  }

  return (
    <BoardInner style={style} collapsable={false}>
      <BGImage imageURI={'wood_grain_bg'}  >
        <SquaresOuter onLayout={layoutListener} >
        {game.getBoardAsArray(whiteOnBottom).map((sq: {pos: Position, piece: Piece | null}) => (
          <SquareComponent 
            position={sq.pos} 
            piece={sq.piece} 
              // See comments above
            sizeInLayout={boardSize && boardSize / 8 }
            key={`key-${sq.pos.rank}-${sq.pos.file}`} 
          />
        ))}
        </SquaresOuter>
      </BGImage>
      <DraggingPiece sizeInLayout={boardSize && boardSize * .85 / 8} />
    </BoardInner>
  )
})

export default Board
