import React from 'react'
import { observer } from 'mobx-react'
import { DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'

import type { ObsSquare } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/styles/stitches.config'
import { useBoardOrientation, useGame } from '~/services'

import { ChessDnDShell } from './board/ChessDnD'
import Square from './board/Square'
import DraggingPiece from './board/DraggingPiece'

import bg from 'assets/img/wood_grain_bg_low_res.jpg'

const BoardInner = styled('div', {

  backgroundImage: `url(${bg})`, 
  aspectRatio: 1,
  width: 'initial', 
  height: '100%', 
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)', 
  gridTemplateRows: 'repeat(8, 1fr)', 

  /*
  @include m.desktop {
    height: 100%; 
  }
  */

  border: '2px $brownDarker solid',
  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px'

})

const Board: React.FC<{ css?: CSS }> = observer(({css}) => {

  const game = useGame()
  const bo = useBoardOrientation()

  return (
    <ChessDnDShell>
      <BoardInner css={css} >
      {game.getBoardAsArray(bo.whiteOnBottom).map((s: ObsSquare) => (
        <Square square={s} key={`key-${s.rank}-${s.file}`} />
      ))}
      </BoardInner>
      <DragOverlay modifiers={[snapCenterToCursor]}>
        <DraggingPiece size={70}  /> 
      </DragOverlay>
    </ChessDnDShell>
  )
})

export default Board
