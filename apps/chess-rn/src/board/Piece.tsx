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
  variant: 
    Color | 
    'whiteLarger' | 
    'blackLarger' | 
    'effectRt1' | 
    'effectRt2' | 
    'effectLt1' | 
    'effectLt2'
  color: string
}

interface TextPieceDesc {
  fontSize: number 
  pieceVariant: Color | 'whiteLarger' | 'blackLarger'
  shadows: ShadowDesc[]
}

const IN_CHECK_SHADOWS = [
  { variant: 'effectRt1', color: 'rgba(100, 0, 0, 0.5)' },
  { variant: 'effectRt2', color: 'rgba(100, 0, 0, 0.2)' },
  { variant: 'effectLt1', color: 'rgba(100, 0, 0, 0.2)' },
  { variant: 'effectLt2', color: 'rgba(100, 0, 0, 0.1)' }
] as ShadowDesc[]

const CAPTURE_SHADOWS = [
  { variant: 'effectRt1', color: 'rgba(228, 134, 5, 0.4)' },
  { variant: 'effectRt2', color: 'rgba(228, 134, 5, 0.1)' },
  { variant: 'effectLt1', color: 'rgba(228, 134, 5, 0.3)' },
  { variant: 'effectLt2', color: 'rgba(228, 134, 5, 0.1)' }
] as ShadowDesc[]

const NORMAL_SHADOW_COLOR = {
  white: 'rgba(0, 0, 0, 0.3)',
  black: 'rgba(0, 0, 0, 0.5)'
}

interface Offset {
  left: number,
  top: number
}

  // This offset makes the image look centered based on applied styles
const IMAGE_OFFSET = {
  left: -1,
  top: -2
}

  // This offset makes the image look centered based on applied styles
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
      },
      black: {
        ...sumOffsets(IMAGE_OFFSET, {left: 2, top: 2}),
      },
      whiteLarger: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 2, top: 2}),
      },
      blackLarger: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 2, top: 2}),
      },
      effectRt1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 1.5, top: 2.5}),
      },
      effectRt2: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 3, top: 3}),
      },
      effectLt1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: -2.5, top: 0}),
      },
      effectLt2: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: -4.5, top: 1}),
      }
    }
  }
})

  // https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native 
const PieceShadow: React.FC<{
  piece: DomainPiece
  fontSize: number
  shadows: ShadowDesc[]
}> = ({
  piece,
  fontSize,
  shadows
}) => (<>
  {shadows.map((d) => (
    <ShadowText style={{fontSize, color: d.color}} variant={d.variant}>{PIECETYPE_TO_UNICODE[piece.type]}</ShadowText> 
  ))}
</>)

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

  const normal = (): {
    fontSize: number
    pieceVariant: Color
  } => ({
    fontSize: size *.80,
    pieceVariant: piece!.color
  })

  const bigger = (): {
    fontSize: number
    pieceVariant: Color | 'whiteLarger' | 'blackLarger'
  } => ({
    fontSize: size *.9,
    pieceVariant: `${piece!.color}Larger` as Color | 'whiteLarger' | 'blackLarger'
  })

  if (piece) {
    const getTextPieceProps = (): TextPieceDesc => {
      if (status === 'king-in-check' && pulses.slow || status === 'in-check-from' && !pulses.slow) {
        return { ...bigger(), shadows: IN_CHECK_SHADOWS }
      } 
        // in 'capture-promote' case, the square will pulse w a yellow border as well.
      else if (status.includes('capture') && pulses.fast) {
        return { ...bigger(), shadows: CAPTURE_SHADOWS }
      } 
      else if (status === 'castle-rook-from' && pulses.slow) {
          // pulse larger
        return {
          ...bigger(),
          shadows: [ { variant: `${piece!.color}Larger`, color: NORMAL_SHADOW_COLOR[piece!.color] }]
        }
      }
        // Default size and shadows
      return {
        ...normal(),
        shadows: [ { variant: piece!.color, color: NORMAL_SHADOW_COLOR[piece!.color] }]
      }
    }
    const { 
      fontSize, 
      pieceVariant, 
      shadows
    } = getTextPieceProps()

    return (
      <View style={[style, {position: 'relative', width: '100%', height: '100%'}]} >
        <PieceShadow {...{piece, fontSize, shadows}} />
        <PieceText style={{fontSize}} variant={pieceVariant}>{PIECETYPE_TO_UNICODE[piece.type]}</PieceText>
      </View>
    ) 
  }
  return <></> 
})

export default Piece