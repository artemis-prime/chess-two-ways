import React, { useEffect, useState } from 'react'
import { 
  View,
  type StyleProp, 
  type ViewStyle,
  type LayoutChangeEvent 
} from 'react-native'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { type ObsSquare } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { useBoardOrientation, useChess } from '~/services'
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

const Board: React.FC<{ 
  disableInput: boolean
  style?: StyleProp<ViewStyle> 
  css?: CSS
}> = observer(({
  disableInput,
  style,
  css 
}) => {

  const game = useChess()
  const bo = useBoardOrientation()
  
    // Squares need to know their size in pt to do internal layout.
    // Instead of forcing each square listen for it's own size changes,
    // we optimize by doing it here and informing them of changes.
    // We are a simple 8x8 grid after all! :)
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined)
  const { layoutListener: layoutListenerDnd, setWhiteOnBottom: notifyDndOrientationChanged } = useDnDConfig()
      

  useEffect(() => (
      // returning autorun()'s cleanup function: https://mobx.js.org/reactions.html#always-dispose-of-reactions
    autorun(() => {
      notifyDndOrientationChanged(bo.whiteOnBottom)
    })
  ),[])

  const layoutListener = (e: LayoutChangeEvent): void  => {
    const {nativeEvent: { layout: {width}}} = e;
    setBoardSize(width)
    layoutListenerDnd(e)
  }

  return (
    <BoardInner style={style} css={css} pointerEvents={(disableInput ? 'none' : 'auto')} collapsable={false}>
      <BGImage imageURI={'wood_grain_bg_low_res'}  >
        <SquaresOuter onLayout={layoutListener} >
        {game.getBoardAsArray(bo.whiteOnBottom).map((s: ObsSquare) => (
              // See comments above
          <Square square={s} sizeInLayout={boardSize && boardSize / 8 } key={`key-${s.rank}-${s.file}`} />
        ))}
        </SquaresOuter>
      </BGImage>
      <DraggingPiece sizeInLayout={boardSize && boardSize * .85 / 8} />
    </BoardInner>
  )
})


const BoardWithDnD: React.FC<{ 
  disableInput: boolean
  style?: StyleProp<ViewStyle> 
}> = ({
  disableInput,
  style,
}) => (
  <ChessDnDShell>
    <Board disableInput={disableInput} style={style} />
  </ChessDnDShell>
)

export default BoardWithDnD
