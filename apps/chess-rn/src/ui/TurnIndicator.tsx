import React from 'react'
import { observer } from 'mobx-react'
import { 
  View, 
  Text, 
  TextStyle, 
  StyleProp, 
  ViewStyle 
} from 'react-native'

import { styled } from '~/stitches.config'

import { useGame } from '~/board/GameProvider'

import SideSwatch from './SideSwatch'



const StyledView = styled(View, {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center'
})

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>
}> = observer(({
  style
}) => {

  const game = useGame()

  return (
    <StyledView style={style}>
      <SideSwatch color={game.currentTurn} style={{height: '100%', aspectRatio: 1}}/>
      <Text style={{fontFamily: 'SqueakyChalkSound', color: '#aaa'}}>'s turn</Text>
    </StyledView>
  )
})

export default TurnIndicator
