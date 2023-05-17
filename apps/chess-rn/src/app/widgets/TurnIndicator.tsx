import React from 'react'
import { observer } from 'mobx-react-lite'
import type { StyleProp, ViewStyle } from 'react-native'
import type { CSS } from 'stitches-native'

import { useGame } from '~/services'
import { Row, DashText } from '~/primatives'

import SideSwatch from './SideSwatch'

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>,
  css?: CSS
}> = observer(({
  style,
  css
}) => {
  const game = useGame()
  return (
    <Row style={style} css={css}>
      <SideSwatch side={game.currentTurn} />
      <DashText>'s turn</DashText>
    </Row>
  )
})

export default TurnIndicator
