import React from 'react'
import { 
  StyleProp,
  Text, 
  View,
  ViewStyle 
} from 'react-native'
import { observer } from 'mobx-react'

import { styled } from '~/conf/stitches.config'

import { 
  type Piece as DomainPiece,
  type Color,
  PIECETYPE_TO_UNICODE 
} from '@artemis-prime/chess-core'

import { DnDRole } from './Square' 
import { usePulses } from './PulseProvider'


interface ShadowDesc {
  variant: 'white' | 'black' | 'feedbackRight1' | 'feedbackLeft1'
  color: string
}

interface TextPieceDesc {
  fontSize: number 
  pieceVariant: Color | 'whiteLarger' | 'blackLarger'
  shadows: ShadowDesc[]
}

interface Offset {
  left: number,
  top: number
}

const IMAGE_OFFSET = {
  left: -1,
  top: -2
}

const IMAGE_OFFSET_LARGER = {
  left: -1,
  top: -6
}

const sumOffsets = (o1: Offset, o2: Offset) => ({
  left: o1.left + o2.left,
  top: o1.top + o2.top
})

const PieceText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  variants: {
    variant: {
      white: {
        color: '$pieceWhite',
        ...IMAGE_OFFSET
      },
      black: {
        color: '$pieceBlack',
        ...IMAGE_OFFSET
      },
      whiteLarger: {
        color: '$pieceWhite',
        ...IMAGE_OFFSET_LARGER
      }, 
      blackLarger: {
        color: '$pieceBlack',
        ...IMAGE_OFFSET_LARGER
      }
    }
  }
})

const ShadowText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  width: '100%',
  height: '100%',
  position: 'absolute',
  variants: {
    variant: {
      white: {
        ...sumOffsets(IMAGE_OFFSET, {left: 2, top: 2}),
        //color: 'rgba(0, 0, 0, 0.3)',
      },
      black: {
        ...sumOffsets(IMAGE_OFFSET, {left: 2, top: 2}),
        //color: 'rgba(0, 0, 0, 0.5)',
      },
      feedbackRight1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 3, top: 3}),
        //color: 'rgba(100, 0, 0, 0.5)',
      },
      feedbackLeft1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: -2.5, top: 0}),
        //color: 'rgba(100, 0, 0, 0.15)',
      }
    }
  }
})

const PieceShadow: React.FC<{
  piece: DomainPiece
  fontSize: number
  desc: ShadowDesc[]
}> = ({
  piece,
  fontSize,
  desc
}) => (<>
  {desc.map((d) => (
    <ShadowText style={{fontSize, color: d.color}} variant={d.variant}>{PIECETYPE_TO_UNICODE[piece.type]}</ShadowText> 
  ))}
</>)

  // https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native 
const Piece: React.FC<{  
  piece: DomainPiece | null
  status: DnDRole,
  size: number // safe
  style?: StyleProp<ViewStyle>
}> = observer(({
  piece,
  status,
  size,
  style 
}) => {

  const pulses = usePulses()

  const bigger = (): {
    fontSize: number
    pieceVariant: Color | 'whiteLarger' | 'blackLarger'
  } => ({
    fontSize: size *.9,
    pieceVariant: `${piece!.color}Larger` as Color | 'whiteLarger' | 'blackLarger'
  })

  if (piece) {
    const getTextPieceProps = (): TextPieceDesc => {
      if (status === 'king-in-check' && pulses.slow || status === 'in-check-from'  && !pulses.slow) {
        return {
          ...bigger(),
          shadows: [
            { variant: 'feedbackRight1', color: 'rgba(100, 0, 0, 0.5)' },
            { variant: 'feedbackLeft1', color: 'rgba(100, 0, 0, 0.15)' }
          ]
        }
      } 
      else if (status === 'capture' && pulses.fast) {
        return {
          ...bigger(),
          shadows: [
            { variant: 'feedbackRight1', color: 'rgba(100, 50, 0, 0.5)' },
            { variant: 'feedbackLeft1', color: 'rgba(100, 50, 0, 0.15)' }
          ]
        }
      } 
      return {
        fontSize: size *.80,
        pieceVariant: piece!.color,
        shadows: [ { variant: piece!.color, color: piece!.color === 'white' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)' }]
      }
    }
    const { 
      fontSize, 
      pieceVariant, 
      shadows
    } = getTextPieceProps()

    return (
      <View style={[style, {position: 'relative', width: '100%', height: '100%'}]} >
        <PieceShadow piece={piece} fontSize={fontSize} desc={shadows} />
        <PieceText style={{fontSize}} variant={pieceVariant}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </View>
    ) 
  }
  return <></> 
})

export default Piece
