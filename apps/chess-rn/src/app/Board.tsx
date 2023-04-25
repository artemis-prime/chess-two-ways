import React, { useEffect, useState } from 'react'
import { 
  View,
  StyleProp, 
  ViewStyle,
  LayoutChangeEvent 
} from 'react-native'
import { observer } from 'mobx-react'

import { type SquareDesc } from '@artemis-prime/chess-core'

import { styled } from '~/style/stitches.config'
import { useGame, useUI } from '~/service'
import { BGImage } from '~/primatives'

import Square from './board/Square'
import { ChessDnDShell, useDnDConfig } from './board/ChessDnD'
import DraggingPiece from './board/DraggingPiece'

const BoardInner = styled(View, {
  aspectRatio: 1,
  width: '100%',
  backgroundColor: 'transparent', // needed for gestures to work on android
  borderWidth: '$thicker',
  borderRadius: '$sm',
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
  backgroundColor: 'transparent', // needed for gestures to work on android
})

const Board: React.FC<{ style?: StyleProp<ViewStyle> }> = observer(({
  style 
}) => {
  const whiteOnBottom = true // TODO: will be ui state soon :)

  const game = useGame()
  const ui = useUI()
  
    // Squares need to know their size in pt to do internal layout.
    // Instead of forcing each square listen for it's own size changes,
    // we optimize by doing it here and informing them of changes.
    // We are a simple 8x8 grid after all! :)
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined)
  const { layoutListener: layoutListenerDnd, setWhiteOnBottom } = useDnDConfig()

  useEffect(() => {
    setWhiteOnBottom(whiteOnBottom)
  }, [whiteOnBottom])

  const layoutListener = (e: LayoutChangeEvent): void  => {
    const {nativeEvent: { layout: {width}}} = e;
    setBoardSize(width)
    layoutListenerDnd(e)
  }

  return (
    <BoardInner style={style} pointerEvents={(ui.menuVisible ? 'none' : 'auto')} collapsable={false}>
      <BGImage imageURI={'wood_grain_bg'}  >
        <SquaresOuter onLayout={layoutListener} >
        {game.getBoardAsArray(whiteOnBottom).map((d: SquareDesc) => (
              // See comments above
          <Square desc={d} sizeInLayout={boardSize && boardSize / 8 } key={`key-${d.position.rank}-${d.position.file}`} />
        ))}
        </SquaresOuter>
      </BGImage>
      <DraggingPiece sizeInLayout={boardSize && boardSize * .85 / 8} />
    </BoardInner>
  )
})


const BoardWithDnD: React.FC<{ 
  style?: StyleProp<ViewStyle> 
}> = ({
  style,
}) => (
  <ChessDnDShell>
    <Board style={style} />
  </ChessDnDShell>
)

export default BoardWithDnD
