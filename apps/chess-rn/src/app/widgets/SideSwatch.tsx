import { View } from 'react-native'

import { styled } from '~/styles/stitches.config'

const SideSwatch = styled(View, {

  height: '$swatchHNormal', 
  width: '$swatchWNormal',
  borderRadius: '$sm',
  borderWidth: '$thicker',
  borderColor: '#777',

  variants: {
    side: {
      white: {
        backgroundColor: '$pieceWhite'
      },
      black: {
        backgroundColor: '$pieceBlack'
      },
    },
    small: {
      true: {
        borderWidth: '$normal',
        height: '$swatchHSmall', 
        width: '$swatchWSmall',
      }
    }
  }
})

export default SideSwatch
