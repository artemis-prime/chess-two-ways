import { View } from 'react-native'

import { styled } from '~/styles/stitches.config'

const SideSwatch = styled(View, {

  height: '$swatchNormalHeight', 
  width: '$swatchNormalWidth',
  borderRadius: '$sm',
  borderWidth: '$thicker',
  borderColor: '#777',

  variants: {
    color: {
      white: {
        backgroundColor: '$pieceWhite'
      },
      black: {
        backgroundColor: '$pieceBlack'
      },
    }
  }
})

export default SideSwatch
