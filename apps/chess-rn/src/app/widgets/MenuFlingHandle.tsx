import React  from 'react'
import { 
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import {
  type FlingGesture,
  GestureDetector
} from 'react-native-gesture-handler'

import { styled } from '~/style'

import { Row } from '~/primatives'
import type { CSS } from 'stitches-native'

const UNICODE = {
  BURGER_MENU: '\u2630',
  ARROW_TO_CORNER_DOWN_RIGHT: '\u21F2',
  ARROW_TO_CORNER_UP_LEFT:'\u21F1'
}

const Figure = styled(Text, {
  color: 'white',
  fontWeight: "900",
})

const MenuFlingHandle: React.FC<{
  menuVisible: boolean
  gesture: FlingGesture
  style?: StyleProp<ViewStyle> 
  css?: CSS
}> = ({
  menuVisible,
  gesture,
  style,
  css
}) => ( 
  <GestureDetector gesture={gesture}>
    <Row style={style} align='center' css={{...css, pl: '$1',  opacity: 0.8}} collapsable={false} >
      {menuVisible ? (
        <Figure style={{fontSize: 30, top: -2, left: -1}}>{UNICODE.ARROW_TO_CORNER_UP_LEFT}</Figure>
      ):(<> 
        <Figure style={{fontSize: 23}}>{UNICODE.BURGER_MENU}</Figure>
        <Figure style={{fontSize: 18, top: 2, left: 2}}>{UNICODE.ARROW_TO_CORNER_DOWN_RIGHT}</Figure>
      </>)}
    </Row>
  </GestureDetector>
)

export default MenuFlingHandle

