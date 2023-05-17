import React  from 'react'
import { Text } from 'react-native'
import { observer } from 'mobx-react-lite'

import { styled } from '~/styles/stitches.config'

import { PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'
import { useDragState } from './ChessDnD'

const StyledText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  position: 'absolute',
  opacity: 0.8,
  variants: {
    side: {
      white: {
        color: '$pieceWhite'
      },
      black: {
        color: '$pieceBlack'
      },
    }
  }
})

const DraggingPiece: React.FC<{ sizeInLayout: number | undefined }> = observer(({
  sizeInLayout,
}) =>  {
  
  const ds = useDragState()

  return (sizeInLayout && ds.piece && ds.offset) ? (
    <StyledText side={ds.piece.side} style={{
      left: ds.offset.x - sizeInLayout / 2, 
      top: ds.offset.y - sizeInLayout / 2,
      fontSize: sizeInLayout * .8,
      width: sizeInLayout,
      height: sizeInLayout
    }}>{PIECETYPE_TO_UNICODE[ds.piece.type]}</StyledText>
  ) : null
})

export default DraggingPiece
