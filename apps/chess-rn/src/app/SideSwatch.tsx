import React from 'react'
import { View } from 'react-native'

import { styled } from '~/style/stitches.config'

const SideSwatch = styled(View, {

  width: 42,
  height: 22,
  borderRadius: 3,
  borderWidth: 2,
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
