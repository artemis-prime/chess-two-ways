import React  from 'react'
import { Text } from 'react-native'
import { observer } from 'mobx-react'

import { styled } from '~/conf/stitches.config'

import { PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'
import { useChessDnD } from './ChessDnD'

const StyledText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  position: 'absolute',
  opacity: 0.8,
  variants: {
    color: {
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
  
  const dnd = useChessDnD()

  return (sizeInLayout && dnd.payload && dnd.offset) ? (
    <StyledText color={dnd.payload.piece.color} style={{
      left: dnd.offset.x - sizeInLayout / 2, 
      top: dnd.offset.y - sizeInLayout / 2,
      fontSize: sizeInLayout * .8,
      width: sizeInLayout,
      height: sizeInLayout
    }}>{PIECETYPE_TO_UNICODE[dnd.payload.piece.type]}</StyledText>
  ) : null
})

export default DraggingPiece
