import React from 'react'
import { 
  View,
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled, css } from '~/stitches.config'

import BGImage from '~/primatives/BGImage'
const imagePath = require('~assets/American-Hard-Maple.jpg')

const BoardInner = styled(View, {
  aspectRatio: 1,
  width: '100%',
  shadow: 'medium'

})


const Board: React.FC<{  
  style?: StyleProp<ViewStyle>
}> = ({
  style 
}) => (
  <BoardInner style={style}>
    <BGImage imagePath={imagePath} style={style}>

    </BGImage>
  </BoardInner>
)

export default Board
