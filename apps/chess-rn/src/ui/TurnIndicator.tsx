import React from 'react'
import { observer } from 'mobx-react'
import { 
  View, 
  Text, 
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled } from '~/conf/stitches.config'
import ui from '~/conf/conf'

import { useGame } from '~/board/GameProvider'
import SideSwatch from './SideSwatch'

const OuterView = styled(View, {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center'
})

const StyledText = styled(Text, {
  ...ui.typography.common,
  color: '$dashText'
})

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>
}> = observer(({
  style
}) => {

  const game = useGame()

  return (
    <OuterView style={[style, {height: ui.typography.common.lineHeight}]}>
      <SideSwatch color={game.currentTurn} style={{
        height: '100%', 
        width: ui.typography.common.lineHeight * 1.3
      }}/>
      <StyledText>'s turn</StyledText>
    </OuterView>
  )
})

export default TurnIndicator
