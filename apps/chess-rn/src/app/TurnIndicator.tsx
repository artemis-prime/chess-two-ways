import React from 'react'
import { observer } from 'mobx-react'
import { 
  View, 
  Text, 
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled } from '~/style/stitches.config'
import ui from '~/style/conf'

import { useGame } from '~/service'
import SideSwatch from './SideSwatch'

const OuterView = styled(View, {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: ui.typography.common.lineHeight,
})

const StyledText = styled(Text, {
  ...ui.typography.common,
  color: '$dashText',
})

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>
}> = observer(({
  style
}) => {

  const game = useGame()

  return (
    <OuterView style={style}>
      <SideSwatch color={game.currentTurn} style={{
        height: ui.typography.common.lineHeight * 0.7, 
        width: ui.typography.common.lineHeight * 1.3
      }}/>
      <StyledText>'s turn</StyledText>
    </OuterView>
  )
})

export default TurnIndicator
