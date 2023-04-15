import React from 'react'
import { 
  View,
  StyleProp,
  ViewStyle
} from 'react-native'

import { styled } from '~/conf/stitches.config'
import ui from '~/conf/conf'

import BGImage from '~/primatives/BGImage'
import UndoRedoWidget from './UndoRedoWidget'
import TurnIndicator from './TurnIndicator'

const StyledBGImage = styled(BGImage, {

  flexGrow: 1,
  flexShrink: 1,
  backgroundColor: '#333',
  minHeight: 200,
  borderWidth: 4,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  borderColor: '$dashBorder',
})

const Dash: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style
}) => (

  <StyledBGImage imageURI={'slate_bg'}  style={style}>
    <View style={{ padding: ui.layout.padding }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TurnIndicator />
        <UndoRedoWidget />
      </View>
    </View>
  </StyledBGImage>
)

export default Dash
