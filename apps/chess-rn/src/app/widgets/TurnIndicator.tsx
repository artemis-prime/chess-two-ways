import React from 'react'
import { observer } from 'mobx-react'
import { 
  View, 
  Text, 
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled, common } from '~/style/stitches.config'

import { useGame } from '~/service'
import SideSwatch from './SideSwatch'

const OuterView = styled(View, {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '$common',
})

const StyledText = styled(Text, common.dashTextCommon)

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>
}> = observer(({
  style
}) => {

  const game = useGame()

  return (
    <OuterView style={style}>
      <SideSwatch color={game.currentTurn} />
      <StyledText>'s turn</StyledText>
    </OuterView>
  )
})

export default TurnIndicator